import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const parseLine = (line: string) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index]?.trim() || '';
    });
    data.push(obj);
  }

  return data;
}

function parseFloatSafe(val: string): number {
  if (!val || val.trim() === '') return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

function parseIntSafe(val: string): number {
  if (!val || val.trim() === '') return 0;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
}

async function main() {
  const dataDir = 'd:\\SIT Website Hack\\data';
  
  const files = {
    cumulative: path.join(dataDir, 'history_cumulative.csv'),
    semesters: path.join(dataDir, 'history_semesters.csv'),
    subjects: path.join(dataDir, 'history_subjects.csv'),
    backlogs: path.join(dataDir, 'history_backlogs.csv'),
    results: path.join(dataDir, 'results_1si24cs.csv'),
  };

  console.log('Parsing CSV files...');
  const cumulativeData = fs.existsSync(files.cumulative) ? parseCSV(files.cumulative) : [];
  const semestersData = fs.existsSync(files.semesters) ? parseCSV(files.semesters) : [];
  const subjectsData = fs.existsSync(files.subjects) ? parseCSV(files.subjects) : [];
  const backlogsData = fs.existsSync(files.backlogs) ? parseCSV(files.backlogs) : [];
  const resultsData = fs.existsSync(files.results) ? parseCSV(files.results) : [];

  console.log('Seeding Batch...');
  const batch = await prisma.batch.upsert({
    where: { id: 1 },
    update: { name: '2024-2028', startYear: 2024, endYear: 2028 },
    create: { name: '2024-2028', startYear: 2024, endYear: 2028 },
  });

  console.log('Seeding Branch...');
  const branch = await prisma.branch.upsert({
    where: { code: 'CS' },
    update: { name: 'Computer Science' },
    create: { code: 'CS', name: 'Computer Science' },
  });

  console.log('Seeding Semesters...');
  const semestersList = [
    { number: 1, term: 'ODD 2024-25', academicYear: '2024-25', type: 'ODD' },
    { number: 2, term: 'EVEN 2024-25', academicYear: '2024-25', type: 'EVEN' },
    { number: 3, term: 'ODD 2025-26', academicYear: '2025-26', type: 'ODD' },
    { number: 4, term: 'EVEN 2025-26', academicYear: '2025-26', type: 'EVEN' },
  ];

  const semesterMap = new Map<string, number>();
  for (const s of semestersList) {
    const sem = await prisma.semester.upsert({
      where: { term: s.term },
      update: s,
      create: s,
    });
    semesterMap.set(s.term, sem.id);
  }

  console.log('Extracting Subjects...');
  const uniqueSubjects = new Map<string, any>();
  for (const row of subjectsData) {
    if (row.Course_Code) {
      let credits = parseIntSafe(row.Credits_Reg);
      if (!uniqueSubjects.has(row.Course_Code) || credits > uniqueSubjects.get(row.Course_Code).defaultCredits) {
        uniqueSubjects.set(row.Course_Code, {
          courseCode: row.Course_Code,
          name: row.Subject_Name || row.Course_Code,
          defaultCredits: credits
        });
      }
    }
  }

  const subjectMap = new Map<string, number>();
  let subjectCount = 0;
  for (const subj of uniqueSubjects.values()) {
    const s = await prisma.subject.upsert({
      where: { courseCode: subj.courseCode },
      update: { name: subj.name, defaultCredits: subj.defaultCredits },
      create: { courseCode: subj.courseCode, name: subj.name, defaultCredits: subj.defaultCredits },
    });
    subjectMap.set(s.courseCode, s.id);
    subjectCount++;
    if (subjectCount % 100 === 0) console.log(`Seeded ${subjectCount} subjects...`);
  }

  console.log('Extracting Students...');
  const genderLookup = new Map<string, string>();
  for (const r of resultsData) {
    if (r.USN && r.Gender) {
      genderLookup.set(r.USN.trim(), r.Gender.trim());
    }
  }

  const studentMap = new Map<string, number>();
  let studentCount = 0;
  for (const row of cumulativeData) {
    const usn = row.USN?.trim();
    if (!usn) continue;

    const student = await prisma.student.upsert({
      where: { usn: usn },
      update: {
        name: row.Name,
        overallCgpa: parseFloatSafe(row.Overall_CGPA),
        creditsEarned: parseIntSafe(row.Credits_Earned_So_Far),
        creditsToEarn: parseIntSafe(row.Credits_To_Be_Earned),
        gender: genderLookup.get(usn) || null,
        batchId: batch.id,
        branchId: branch.id,
      },
      create: {
        usn: usn,
        name: row.Name,
        overallCgpa: parseFloatSafe(row.Overall_CGPA),
        creditsEarned: parseIntSafe(row.Credits_Earned_So_Far),
        creditsToEarn: parseIntSafe(row.Credits_To_Be_Earned),
        gender: genderLookup.get(usn) || null,
        batchId: batch.id,
        branchId: branch.id,
      },
    });
    studentMap.set(usn, student.id);
    studentCount++;
    if (studentCount % 50 === 0) console.log(`Seeded ${studentCount} students...`);
  }

  console.log('Seeding Semester Results...');
  let semResCount = 0;
  for (const row of semestersData) {
    const usn = row.USN?.trim();
    const studentId = studentMap.get(usn);
    const semesterId = semesterMap.get(row.Semester?.trim());

    if (studentId && semesterId) {
      await prisma.semesterResult.upsert({
        where: {
          studentId_semesterId: {
            studentId,
            semesterId,
          }
        },
        update: {
          creditsRegistered: parseIntSafe(row.Credits_Registered),
          creditsEarned: parseIntSafe(row.Credits_Earned),
          sgpa: parseFloatSafe(row.SGPA),
          cgpa: parseFloatSafe(row.CGPA),
        },
        create: {
          studentId,
          semesterId,
          creditsRegistered: parseIntSafe(row.Credits_Registered),
          creditsEarned: parseIntSafe(row.Credits_Earned),
          sgpa: parseFloatSafe(row.SGPA),
          cgpa: parseFloatSafe(row.CGPA),
        }
      });
      semResCount++;
      if (semResCount % 100 === 0) console.log(`Seeded ${semResCount} semester results...`);
    }
  }

  console.log('Seeding Subject Results...');
  let subjResCount = 0;
  for (const row of subjectsData) {
    if (row.Semester === 'UNKNOWN') continue;

    const usn = row.USN?.trim();
    const studentId = studentMap.get(usn);
    const subjectId = subjectMap.get(row.Course_Code?.trim());
    const semesterId = semesterMap.get(row.Semester?.trim());

    if (studentId && subjectId && semesterId) {
      await prisma.subjectResult.upsert({
        where: {
          studentId_subjectId_semesterId: {
            studentId,
            subjectId,
            semesterId,
          }
        },
        update: {
          cieMarks: parseIntSafe(row.CIE),
          attendance: parseIntSafe(row.ATT),
          creditsEarned: parseIntSafe(row.Credits_Earned),
          gpa: parseFloatSafe(row.GPA),
          grade: row.Grade || '',
        },
        create: {
          studentId,
          subjectId,
          semesterId,
          cieMarks: parseIntSafe(row.CIE),
          attendance: parseIntSafe(row.ATT),
          creditsEarned: parseIntSafe(row.Credits_Earned),
          gpa: parseFloatSafe(row.GPA),
          grade: row.Grade || '',
        }
      });
      subjResCount++;
      if (subjResCount % 500 === 0) console.log(`Seeded ${subjResCount} subject results...`);
    }
  }

  console.log('Seeding Backlogs...');
  let backlogCount = 0;
  for (const row of backlogsData) {
    const usn = row.USN?.trim();
    const studentId = studentMap.get(usn);
    
    let rawCourseCode = row.Course_Code?.trim() || '';
    rawCourseCode = rawCourseCode.replace(/\(T\)|\(P\)/g, '').trim();

    const subjectId = subjectMap.get(rawCourseCode);

    if (studentId && subjectId) {
      await prisma.backlog.upsert({
        where: {
          studentId_subjectId: {
            studentId,
            subjectId,
          }
        },
        update: {
          attempts: parseIntSafe(row.Attempts),
        },
        create: {
          studentId,
          subjectId,
          attempts: parseIntSafe(row.Attempts),
        }
      });
      backlogCount++;
      if (backlogCount % 50 === 0) console.log(`Seeded ${backlogCount} backlogs...`);
    }
  }

  console.log('Seeding Complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
