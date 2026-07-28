import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = 'd:\\SIT Website Hack\\newData\\raw_scraped_cs_2024_2028.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`Loading clean JSON dataset from ${jsonPath}...`);
  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${rawData.length} student profiles.`);

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

  const semesterMap = new Map<number, number>();
  for (const s of semestersList) {
    const sem = await prisma.semester.upsert({
      where: { term: s.term },
      update: s,
      create: s,
    });
    semesterMap.set(s.number, sem.id);
  }

  console.log('Collecting and Seeding Subjects...');
  const uniqueSubjects = new Map<string, { courseCode: string; name: string; credits: number }>();
  
  for (const student of rawData) {
    for (const sem of student.semesters || []) {
      for (const sub of sem.subjects || []) {
        const courseCode = sub.courseCode.trim();
        const name = sub.subjectName.trim();
        const credits = Number(sub.creditsReg) || 0;
        
        if (!uniqueSubjects.has(courseCode) || credits > uniqueSubjects.get(courseCode)!.credits) {
          uniqueSubjects.set(courseCode, { courseCode, name, credits });
        }
      }
    }
  }

  const subjectMap = new Map<string, number>();
  for (const subj of uniqueSubjects.values()) {
    const s = await prisma.subject.upsert({
      where: { courseCode: subj.courseCode },
      update: { name: subj.name, defaultCredits: subj.credits },
      create: { courseCode: subj.courseCode, name: subj.name, defaultCredits: subj.credits },
    });
    subjectMap.set(s.courseCode, s.id);
  }
  console.log(`Seeded ${subjectMap.size} unique subjects.`);

  console.log('Seeding Students & Semester/Subject Results...');
  let studentCount = 0;
  let semResCount = 0;
  let subjResCount = 0;
  let backlogCount = 0;

  for (const prof of rawData) {
    const usn = prof.usn.trim().toUpperCase();
    
    const student = await prisma.student.upsert({
      where: { usn },
      update: {
        name: prof.name,
        section: prof.section || 'A',
        overallCgpa: Number(prof.overallCgpa) || 0,
        creditsEarned: Number(prof.creditsEarnedSoFar) || 0,
        creditsToEarn: Number(prof.creditsToBeEarned) || 0,
        batchId: batch.id,
        branchId: branch.id,
      },
      create: {
        usn,
        name: prof.name,
        section: prof.section || 'A',
        overallCgpa: Number(prof.overallCgpa) || 0,
        creditsEarned: Number(prof.creditsEarnedSoFar) || 0,
        creditsToEarn: Number(prof.creditsToBeEarned) || 0,
        batchId: batch.id,
        branchId: branch.id,
      },
    });
    
    studentCount++;

    for (const sem of prof.semesters || []) {
      const snum = sem.semesterNumber;
      const semesterId = semesterMap.get(snum);
      
      if (!semesterId) continue;

      await prisma.semesterResult.upsert({
        where: {
          studentId_semesterId: {
            studentId: student.id,
            semesterId,
          }
        },
        update: {
          creditsRegistered: Number(sem.creditsRegistered) || 0,
          creditsEarned: Number(sem.creditsEarned) || 0,
          sgpa: Number(sem.sgpa) || 0,
          cgpa: Number(sem.cgpa) || 0,
        },
        create: {
          studentId: student.id,
          semesterId,
          creditsRegistered: Number(sem.creditsRegistered) || 0,
          creditsEarned: Number(sem.creditsEarned) || 0,
          sgpa: Number(sem.sgpa) || 0,
          cgpa: Number(sem.cgpa) || 0,
        }
      });
      semResCount++;

      for (const sub of sem.subjects || []) {
        const subjectId = subjectMap.get(sub.courseCode.trim());
        if (!subjectId) continue;

        const isFailed = ['F', 'DX', 'NE', 'AB', 'NP'].includes(sub.grade);

        await prisma.subjectResult.upsert({
          where: {
            studentId_subjectId_semesterId: {
              studentId: student.id,
              subjectId,
              semesterId,
            }
          },
          update: {
            cieMarks: Number(sub.cie) || 0,
            attendance: Number(sub.attendance) || 0,
            creditsEarned: Number(sub.creditsEarned) || 0,
            gpa: Number(sub.gpa) || 0,
            grade: sub.grade || 'P',
            attempts: Number(sub.attempts) || 1,
            backlogCleared: Boolean(sub.backlogCleared),
            originalGrade: sub.originalGrade || null,
          },
          create: {
            studentId: student.id,
            subjectId,
            semesterId,
            cieMarks: Number(sub.cie) || 0,
            attendance: Number(sub.attendance) || 0,
            creditsEarned: Number(sub.creditsEarned) || 0,
            gpa: Number(sub.gpa) || 0,
            grade: sub.grade || 'P',
            attempts: Number(sub.attempts) || 1,
            backlogCleared: Boolean(sub.backlogCleared),
            originalGrade: sub.originalGrade || null,
          }
        });
        subjResCount++;

        if (isFailed) {
          await prisma.backlog.upsert({
            where: {
              studentId_subjectId: {
                studentId: student.id,
                subjectId,
              }
            },
            update: { attempts: Number(sub.attempts) || 1 },
            create: {
              studentId: student.id,
              subjectId,
              attempts: Number(sub.attempts) || 1,
            }
          });
          backlogCount++;
        }
      }
    }
  }

  console.log(`Seeding Complete! ${studentCount} students, ${semResCount} sem results, ${subjResCount} subject results, ${backlogCount} active backlogs.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
