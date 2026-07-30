import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const csJsonPath = 'd:\\SIT Website Hack\\newData\\raw_scraped_cs_2024_2028.json';
  const isJsonPath = 'd:\\SIT Website Hack\\newData\\raw_scraped_is_2024_2028.json';
  const adJsonPath = 'd:\\SIT Website Hack\\newData\\raw_scraped_ad_2024_2028.json';
  const ciJsonPath = 'd:\\SIT Website Hack\\newData\\raw_scraped_ci_2024_2028.json';
  const ecJsonPath = 'd:\\SIT Website Hack\\newData\\raw_scraped_ec_2024_2028.json';
  
  let rawDataCS: any[] = [];
  let rawDataIS: any[] = [];
  let rawDataAD: any[] = [];
  let rawDataCI: any[] = [];
  let rawDataEC: any[] = [];

  if (fs.existsSync(csJsonPath)) {
    console.log(`Loading CS dataset from ${csJsonPath}...`);
    rawDataCS = JSON.parse(fs.readFileSync(csJsonPath, 'utf-8'));
    console.log(`Loaded ${rawDataCS.length} CS student profiles.`);
  }

  if (fs.existsSync(isJsonPath)) {
    console.log(`Loading IS dataset from ${isJsonPath}...`);
    rawDataIS = JSON.parse(fs.readFileSync(isJsonPath, 'utf-8'));
    console.log(`Loaded ${rawDataIS.length} IS student profiles.`);
  }

  if (fs.existsSync(adJsonPath)) {
    console.log(`Loading AD (AIDS) dataset from ${adJsonPath}...`);
    rawDataAD = JSON.parse(fs.readFileSync(adJsonPath, 'utf-8'));
    console.log(`Loaded ${rawDataAD.length} AD student profiles.`);
  }

  if (fs.existsSync(ciJsonPath)) {
    console.log(`Loading CI (AIML) dataset from ${ciJsonPath}...`);
    rawDataCI = JSON.parse(fs.readFileSync(ciJsonPath, 'utf-8'));
    console.log(`Loaded ${rawDataCI.length} CI student profiles.`);
  }

  if (fs.existsSync(ecJsonPath)) {
    console.log(`Loading EC dataset from ${ecJsonPath}...`);
    rawDataEC = JSON.parse(fs.readFileSync(ecJsonPath, 'utf-8'));
    console.log(`Loaded ${rawDataEC.length} EC student profiles.`);
  }

  console.log('Clearing database tables for clean lightning-fast seed...');
  await prisma.subjectResult.deleteMany({});
  await prisma.semesterResult.deleteMany({});
  await prisma.backlog.deleteMany({});
  await prisma.student.deleteMany({});

  console.log('Seeding Batch & Branches...');
  const batch = await prisma.batch.upsert({
    where: { id: 1 },
    update: { name: '2024-2028', startYear: 2024, endYear: 2028 },
    create: { name: '2024-2028', startYear: 2024, endYear: 2028 },
  });

  const branchCS = await prisma.branch.upsert({
    where: { code: 'CS' },
    update: { name: 'Computer Science' },
    create: { code: 'CS', name: 'Computer Science' },
  });

  const branchIS = await prisma.branch.upsert({
    where: { code: 'IS' },
    update: { name: 'Information Science' },
    create: { code: 'IS', name: 'Information Science' },
  });

  const branchAD = await prisma.branch.upsert({
    where: { code: 'AD' },
    update: { name: 'Artificial Intelligence & Data Science' },
    create: { code: 'AD', name: 'Artificial Intelligence & Data Science' },
  });

  const branchCI = await prisma.branch.upsert({
    where: { code: 'CI' },
    update: { name: 'Artificial Intelligence & Machine Learning' },
    create: { code: 'CI', name: 'Artificial Intelligence & Machine Learning' },
  });

  const branchEC = await prisma.branch.upsert({
    where: { code: 'EC' },
    update: { name: 'Electronics & Communication Engineering' },
    create: { code: 'EC', name: 'Electronics & Communication Engineering' },
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

  const allStudentsData = [
    ...rawDataCS.map(s => ({ ...s, branchId: branchCS.id })),
    ...rawDataIS.map(s => ({ ...s, branchId: branchIS.id })),
    ...rawDataAD.map(s => ({ ...s, branchId: branchAD.id })),
    ...rawDataCI.map(s => ({ ...s, branchId: branchCI.id })),
    ...rawDataEC.map(s => ({ ...s, branchId: branchEC.id }))
  ];

  console.log(`Collecting Subjects across all ${allStudentsData.length} students...`);
  const uniqueSubjects = new Map<string, { courseCode: string; name: string; credits: number }>();
  for (const student of allStudentsData) {
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

  console.log('Bulk Creating Students...');
  await prisma.student.createMany({
    data: allStudentsData.map((prof: any) => ({
      usn: prof.usn.trim().toUpperCase(),
      name: prof.name,
      section: prof.section || 'A',
      overallCgpa: Number(prof.overallCgpa) || 0,
      creditsEarned: Number(prof.creditsEarnedSoFar) || 0,
      creditsToEarn: Number(prof.creditsToBeEarned) || 0,
      batchId: batch.id,
      branchId: prof.branchId,
    }))
  });

  const allDbStudents = await prisma.student.findMany({
    select: { id: true, usn: true }
  });

  const studentIdMap = new Map<string, number>();
  allDbStudents.forEach(s => studentIdMap.set(s.usn, s.id));

  console.log('Preparing Semester & Subject Results...');
  const semesterResultsToInsert: any[] = [];
  const subjectResultsToInsert: any[] = [];
  const backlogEntriesToInsert: any[] = [];

  for (const student of allStudentsData) {
    const studentId = studentIdMap.get(student.usn.trim().toUpperCase());
    if (!studentId) continue;

    for (const sem of student.semesters || []) {
      const semesterId = semesterMap.get(sem.semesterNumber);
      if (!semesterId) continue;

      semesterResultsToInsert.push({
        studentId,
        semesterId,
        creditsRegistered: Number(sem.creditsRegistered) || 0,
        creditsEarned: Number(sem.creditsEarned) || 0,
        sgpa: Number(sem.sgpa) || 0,
        cgpa: Number(sem.cgpa) || 0,
      });

      for (const sub of sem.subjects || []) {
        const courseCode = sub.courseCode.trim();
        const subjectId = subjectMap.get(courseCode);
        if (!subjectId) continue;

        const grade = (sub.grade || 'P').trim().toUpperCase();
        const isFail = ['F', 'DX', 'NE', 'AB', 'NP'].includes(grade);
        const isClearedInRetake = Boolean(sub.backlogCleared) || (Number(sub.attempts) > 1);

        subjectResultsToInsert.push({
          studentId,
          subjectId,
          semesterId,
          cieMarks: Number(sub.cie) || 0,
          attendance: Number(sub.att) || 0,
          creditsEarned: Number(sub.creditsEarned) || 0,
          gpa: Number(sub.gpa) || 0,
          grade: grade,
          attempts: Number(sub.attempts) || (isClearedInRetake ? 2 : 1),
          backlogCleared: isClearedInRetake,
          originalGrade: sub.originalGrade || (isClearedInRetake ? 'F' : null),
        });

        if (isFail) {
          backlogEntriesToInsert.push({
            studentId,
            subjectId,
            attempts: Number(sub.attempts) || 1,
          });
        }
      }
    }
  }

  console.log(`Bulk inserting ${semesterResultsToInsert.length} Semester Results...`);
  await prisma.semesterResult.createMany({ data: semesterResultsToInsert });

  console.log(`Bulk inserting ${subjectResultsToInsert.length} Subject Results...`);
  await prisma.subjectResult.createMany({ data: subjectResultsToInsert });

  console.log(`Bulk inserting Backlogs...`);
  const backlogMap = new Map<string, { studentId: number; subjectId: number; attempts: number }>();
  for (const b of backlogEntriesToInsert) {
    const key = `${b.studentId}_${b.subjectId}`;
    if (!backlogMap.has(key)) {
      backlogMap.set(key, b);
    }
  }
  await prisma.backlog.createMany({ data: Array.from(backlogMap.values()) });

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
