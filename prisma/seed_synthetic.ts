import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// First & Last Name pools for realistic student generation
const FIRST_NAMES_MALE = [
  'AARAV', 'ADITYA', 'AKSHAY', 'ANIRUDDH', 'BHUVAN', 'CHETAN', 'DARSHAN', 'DEEPAK',
  'HARSH', 'KARTHIK', 'MANOJ', 'MOHAMMED', 'NEHAL', 'PARTH', 'PRANAV', 'RAHUL',
  'RISHITH', 'ROHIT', 'SAMARTH', 'SANDESH', 'SHASHANK', 'SUHAS', 'SURYANSH', 'TARUN',
  'VARUN', 'VINAYAK', 'VISHWANATH', 'VIVEK', 'YASH', 'YOGANANDA'
];

const FIRST_NAMES_FEMALE = [
  'AKSHATHA', 'ANANYA', 'ANUSHA', 'BINDUDHARA', 'CHAITHRA', 'DARSHINI', 'HITHASHREE',
  'KIRANKUMARI', 'MONIKA', 'POOJA', 'PRIYA', 'RAKSHA', 'RAMYASHREE', 'SAHANA',
  'SHREYA', 'SOUJANYA', 'SUPRIYA', 'TEJASWINI', 'VANITHA', 'VARSHINI'
];

const LAST_NAMES = [
  'GOWDA', 'KUMAR', 'PATEL', 'SHETTY', 'RAO', 'SHARMA', 'SINGH', 'DESHMUKH',
  'MUDIGOUDRA', 'B S', 'H M', 'M GOWDA', 'RATHOD', 'HIREMATH', 'INGALAGI',
  'YADAV', 'PARUK', 'KATYARMAL', 'GUPTA', 'ALUR'
];

const MENTORS = [
  'Dr. R. S. Kadadevarmath', 'Dr. K. N. Subramanya', 'Dr. H. S. Jayanna',
  'Dr. N. R. Sunitha', 'Dr. M. B. Nirmala', 'Dr. T. R. Dinesh'
];

const BLOOD_GROUPS = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'];
const ADMISSION_TYPES = ['CET', 'COMEDK', 'Management'];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 2): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

function calculateGrade(gpa: number): { grade: string; gradePoint: number } {
  if (gpa >= 9.0) return { grade: 'O', gradePoint: 10 };
  if (gpa >= 8.0) return { grade: 'A+', gradePoint: 9 };
  if (gpa >= 7.0) return { grade: 'A', gradePoint: 8 };
  if (gpa >= 6.0) return { grade: 'B+', gradePoint: 7 };
  if (gpa >= 5.5) return { grade: 'B', gradePoint: 6 };
  if (gpa >= 5.0) return { grade: 'C', gradePoint: 5 };
  if (gpa >= 4.0) return { grade: 'P', gradePoint: 4 };
  return { grade: 'F', gradePoint: 0 };
}

async function main() {
  console.log('🚀 Starting Comprehensive Synthetic Data Generator...');

  console.log('Clearing database tables...');
  await prisma.subjectResult.deleteMany({});
  await prisma.semesterResult.deleteMany({});
  await prisma.backlog.deleteMany({});
  await prisma.student.deleteMany({});

  console.log('Creating Academic Batch...');
  const batch = await prisma.batch.upsert({
    where: { id: 1 },
    update: { name: '2024-2028', startYear: 2024, endYear: 2028 },
    create: { name: '2024-2028', startYear: 2024, endYear: 2028 },
  });

  console.log('Creating Academic Branches...');
  const branchesConfig = [
    { code: 'CS', name: 'Computer Science & Engineering', count: 200, sections: ['A', 'B', 'C'] },
    { code: 'IS', name: 'Information Science & Engineering', count: 122, sections: ['A', 'B'] },
    { code: 'AD', name: 'Artificial Intelligence & Data Science', count: 60, sections: ['A'] },
    { code: 'CI', name: 'Artificial Intelligence & Machine Learning', count: 60, sections: ['A'] },
    { code: 'EC', name: 'Electronics & Communication Engineering', count: 120, sections: ['A', 'B'] }
  ];

  const branchDbMap = new Map<string, any>();
  for (const b of branchesConfig) {
    const branchObj = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name },
      create: { code: b.code, name: b.name },
    });
    branchDbMap.set(b.code, branchObj);
  }

  console.log('Creating Semesters...');
  const semestersConfig = [
    { number: 1, term: 'ODD 2024-25', academicYear: '2024-25', type: 'ODD' },
    { number: 2, term: 'EVEN 2024-25', academicYear: '2024-25', type: 'EVEN' },
    { number: 3, term: 'ODD 2025-26', academicYear: '2025-26', type: 'ODD' },
    { number: 4, term: 'EVEN 2025-26', academicYear: '2025-26', type: 'EVEN' },
  ];

  const semesterDbMap = new Map<number, any>();
  for (const s of semestersConfig) {
    const semObj = await prisma.semester.upsert({
      where: { term: s.term },
      update: s,
      create: s,
    });
    semesterDbMap.set(s.number, semObj);
  }

  console.log('Creating Course Curriculum per Semester...');
  const curriculum: Record<number, Array<{ code: string; name: string; credits: number }>> = {
    1: [
      { code: 'MATS1', name: 'MATHEMATICS-I FOR ENGINEERING STREAM', credits: 4 },
      { code: 'PHYS', name: 'PHYSICS FOR ENGINEERING STREAM', credits: 4 },
      { code: 'ESCF6', name: 'PRINCIPLES OF PROGRAMMING USING C', credits: 3 },
      { code: 'ESCO3', name: 'INTRODUCTION TO ELECTRONICS ENGINEERING', credits: 3 },
      { code: 'ETC08', name: 'RENEWABLE ENERGY SOURCES', credits: 3 },
      { code: 'CC01', name: 'COMMUNICATIVE ENGLISH', credits: 1 },
      { code: 'CC03', name: 'BALAKE KANNADA', credits: 1 },
      { code: 'CC06', name: 'INNOVATION AND DESIGN THINKING', credits: 1 },
    ],
    2: [
      { code: 'MATS2', name: 'MATHEMATICS-II FOR ENGINEERING STREAM', credits: 4 },
      { code: 'CHES', name: 'CHEMISTRY FOR ENGINEERING STREAM', credits: 4 },
      { code: 'PLC2', name: 'INTRODUCTION TO PYTHON PROGRAMMING', credits: 3 },
      { code: 'ESCO2', name: 'INTRODUCTION TO ELECTRICAL ENGINEERING', credits: 3 },
      { code: 'ESCF1', name: 'COMPUTER AIDED ENGINEERING DRAWING', credits: 3 },
      { code: 'CC02', name: 'PROFESSIONAL WRITING SKILLS IN ENGLISH', credits: 1 },
      { code: 'CC05', name: 'INDIAN CONSTITUTION', credits: 1 },
      { code: 'CC07', name: 'SCIENTIFIC FOUNDATIONS OF HEALTH', credits: 1 },
    ],
    3: [
      { code: 'S3MAT1', name: 'STATISTICS AND PROBABILITY', credits: 3 },
      { code: 'S3CCS01', name: 'DATA STRUCTURES AND APPLICATIONS', credits: 3 },
      { code: 'S3CCSI01', name: 'OPERATING SYSTEMS', credits: 4 },
      { code: 'S3CCSI02', name: 'DIGITAL CIRCUITS AND COMPUTER ORGANIZATIONS', credits: 4 },
      { code: 'S3CCSI03', name: 'JAVA PROGRAMMING', credits: 3 },
      { code: 'S3CCSL01', name: 'DATA STRUCTURES AND APPLICATIONS LABORATORY', credits: 1 },
      { code: 'SHS01', name: 'SOCIAL CONNECT AND RESPONSIBILITIES', credits: 1 },
      { code: 'S3CCSA05', name: 'DEVOPS CORE', credits: 1 },
    ],
    4: [
      { code: 'S4CCS01', name: 'DESIGN AND ANALYSIS OF ALGORITHMS', credits: 3 },
      { code: 'S4CCS02', name: 'DISCRETE MATHEMATICAL STRUCTURES', credits: 3 },
      { code: 'S4CSI01', name: 'MICROCONTROLLER AND EMBEDDED SYSTEMS', credits: 4 },
      { code: 'S4CSI02', name: 'THEORY OF COMPUTATIONS', credits: 4 },
      { code: 'S4CCA01', name: 'BIOLOGY FOR ENGINEERS', credits: 3 },
      { code: 'S4CCSL01', name: 'DESIGN AND ANALYSIS OF ALGORITHMS LABORATORY', credits: 1 },
      { code: 'S4CSA01', name: 'JAVASCRIPT & WEB TECHNOLOGIES', credits: 1 },
      { code: 'SHS02', name: 'UNIVERSAL HUMAN VALUES', credits: 1 },
    ]
  };

  const subjectDbMap = new Map<string, any>();
  for (const semNum of [1, 2, 3, 4]) {
    for (const c of curriculum[semNum]) {
      const subjObj = await prisma.subject.upsert({
        where: { courseCode: c.code },
        update: { name: c.name, defaultCredits: c.credits },
        create: { courseCode: c.code, name: c.name, defaultCredits: c.credits },
      });
      subjectDbMap.set(c.code, subjObj);
    }
  }

  // Generate Students per Branch
  for (const bConfig of branchesConfig) {
    const branchDb = branchDbMap.get(bConfig.code);
    console.log(`Generating ${bConfig.count} students for ${bConfig.code} (${bConfig.name})...`);

    const studentsToCreate: any[] = [];
    const secSize = Math.ceil(bConfig.count / bConfig.sections.length);

    for (let i = 1; i <= bConfig.count; i++) {
      const isMale = Math.random() > 0.45;
      const firstName = getRandomElement(isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
      const lastName = getRandomElement(LAST_NAMES);
      const fullName = `${firstName} ${lastName}`;
      
      const numStr = String(i).padStart(3, '0');
      const usn = `1SI24${bConfig.code}${numStr}`;
      
      const secIdx = Math.min(Math.floor((i - 1) / secSize), bConfig.sections.length - 1);
      const section = bConfig.sections[secIdx];

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@sit.ac.in`;
      const phone = `+91 98${getRandomInt(10000000, 99999999)}`;
      const mentorName = getRandomElement(MENTORS);
      const admissionType = getRandomElement(ADMISSION_TYPES);
      const bloodGroup = getRandomElement(BLOOD_GROUPS);

      studentsToCreate.push({
        usn,
        name: fullName,
        gender: isMale ? 'Male' : 'Female',
        section,
        batchId: batch.id,
        branchId: branchDb.id,
        email,
        phone,
        mentorName,
        admissionType,
        bloodGroup,
        creditsEarned: 80,
        creditsToEarn: 80,
        overallCgpa: 0.0 // Will be computed after semester results
      });
    }

    await prisma.student.createMany({ data: studentsToCreate });
  }

  // Fetch all DB Students
  const allDbStudents = await prisma.student.findMany({
    include: { branch: true }
  });

  console.log(`Created ${allDbStudents.length} total students. Generating Semester & Subject Results...`);

  const semesterResultsToInsert: any[] = [];
  const subjectResultsToInsert: any[] = [];

  // Structure to store computed SGPAs per student per semester for CGPA & Rank calculation
  const studentSemPerformance: Record<number, Record<number, { studentId: number; section: string; branchId: number; sgpa: number; cgpa: number; creditsEarned: number }>> = {};

  for (const student of allDbStudents) {
    let cumulativePoints = 0;
    let cumulativeCredits = 0;

    studentSemPerformance[student.id] = {};

    for (const semNum of [1, 2, 3, 4]) {
      const semDb = semesterDbMap.get(semNum);
      const subjects = curriculum[semNum];

      let semPoints = 0;
      let semCreditsReg = 0;
      let semCreditsEarned = 0;

      for (const c of subjects) {
        const subjDb = subjectDbMap.get(c.code);
        const credits = c.credits;

        // Base GPA generation centered around ~8.0
        const baseGpa = getRandomFloat(4.5, 9.8, 1);
        const { grade, gradePoint } = calculateGrade(baseGpa);
        const isFail = grade === 'F';
        
        const cieMarks = getRandomInt(25, 49);
        const seeMarks = isFail ? getRandomInt(15, 35) : getRandomInt(45, 98);
        const assignmentMarks = getRandomInt(7, 10);
        const attendance = getRandomInt(82, 100);

        const creditsEarned = isFail ? 0 : credits;
        semCreditsReg += credits;
        semCreditsEarned += creditsEarned;
        
        semPoints += gradePoint * credits;

        const isRetake = Math.random() < 0.05; // 5% chance of retake record

        subjectResultsToInsert.push({
          studentId: student.id,
          subjectId: subjDb.id,
          semesterId: semDb.id,
          cieMarks,
          seeMarks,
          assignmentMarks,
          attendance,
          creditsEarned,
          gpa: baseGpa,
          gradePoint,
          grade,
          attempts: isRetake ? 2 : 1,
          backlogCleared: isRetake,
          originalGrade: isRetake ? 'F' : null
        });
      }

      cumulativePoints += semPoints;
      cumulativeCredits += semCreditsReg;

      const sgpa = Number((semPoints / semCreditsReg).toFixed(2));
      const cgpa = Number((cumulativePoints / cumulativeCredits).toFixed(2));

      studentSemPerformance[student.id][semNum] = {
        studentId: student.id,
        section: student.section || 'A',
        branchId: student.branchId,
        sgpa,
        cgpa,
        creditsEarned: semCreditsEarned
      };
    }
  }

  // Calculate Ranks per Semester per Branch and per Section
  console.log('Calculating Section Ranks & Branch Ranks...');

  for (const semNum of [1, 2, 3, 4]) {
    const semDb = semesterDbMap.get(semNum);

    // Group by Branch
    const branchGroups = new Map<number, any[]>();
    for (const studentId in studentSemPerformance) {
      const perf = studentSemPerformance[studentId][semNum];
      if (!branchGroups.has(perf.branchId)) branchGroups.set(perf.branchId, []);
      branchGroups.get(perf.branchId)!.push(perf);
    }

    for (const [branchId, branchPerfs] of branchGroups.entries()) {
      // Sort by CGPA desc to assign Branch Ranks
      branchPerfs.sort((a, b) => b.cgpa - a.cgpa);
      branchPerfs.forEach((p, idx) => { p.rankInBranch = idx + 1; });

      // Group by Section to assign Section Ranks
      const sectionGroups = new Map<string, any[]>();
      for (const p of branchPerfs) {
        if (!sectionGroups.has(p.section)) sectionGroups.set(p.section, []);
        sectionGroups.get(p.section)!.push(p);
      }

      for (const [sec, secPerfs] of sectionGroups.entries()) {
        secPerfs.sort((a, b) => b.cgpa - a.cgpa);
        secPerfs.forEach((p, idx) => { p.rankInSection = idx + 1; });
      }

      for (const p of branchPerfs) {
        semesterResultsToInsert.push({
          studentId: p.studentId,
          semesterId: semDb.id,
          creditsRegistered: 20,
          creditsEarned: p.creditsEarned,
          sgpa: p.sgpa,
          cgpa: p.cgpa,
          rankInBranch: p.rankInBranch,
          rankInSection: p.rankInSection,
          totalAttendance: getRandomFloat(86.0, 98.5, 1)
        });
      }
    }
  }

  console.log(`Bulk inserting ${semesterResultsToInsert.length} Semester Results...`);
  await prisma.semesterResult.createMany({ data: semesterResultsToInsert });

  console.log(`Bulk inserting ${subjectResultsToInsert.length} Subject Results...`);
  await prisma.subjectResult.createMany({ data: subjectResultsToInsert });

  // Update Student overall CGPA from Sem 4 CGPA
  console.log('Updating overall student CGPAs...');
  for (const studentId in studentSemPerformance) {
    const finalSem4Cgpa = studentSemPerformance[studentId][4].cgpa;
    await prisma.student.update({
      where: { id: Number(studentId) },
      data: { overallCgpa: finalSem4Cgpa }
    });
  }

  console.log('🎉 Synthetic Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
