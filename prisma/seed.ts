import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// First & Last Name pools for realistic student generation
const FIRST_NAMES_MALE = [
  'AARAV', 'ADITYA', 'AKSHAY', 'ANIRUDDH', 'BHUVAN', 'CHETAN', 'DARSHAN', 'DEEPAK',
  'HARSH', 'KARTHIK', 'MANOJ', 'MOHAMMED', 'NEHAL', 'PARTH', 'PRANAV', 'RAHUL',
  'RISHITH', 'ROHIT', 'SAMARTH', 'SANDESH', 'SHASHANK', 'SUHAS', 'SURYANSH', 'TARUN',
  'VARUN', 'VINAYAK', 'VISHWANATH', 'VIVEK', 'YASH', 'YOGANANDA', 'ABHISHEK', 'BHARATH',
  'CHIRAG', 'GURUPRASAD', 'HEMANTH', 'JAGADISH', 'KIRAN', 'LIKITH', 'NANDAN', 'PAVAN'
];

const FIRST_NAMES_FEMALE = [
  'AKSHATHA', 'ANANYA', 'ANUSHA', 'BINDUDHARA', 'CHAITHRA', 'DARSHINI', 'HITHASHREE',
  'KIRANKUMARI', 'MONIKA', 'POOJA', 'PRIYA', 'RAKSHA', 'RAMYASHREE', 'SAHANA',
  'SHREYA', 'SOUJANYA', 'SUPRIYA', 'TEJASWINI', 'VANITHA', 'VARSHINI', 'AISHWARYA',
  'BHAVANA', 'DIVYA', 'HARSHITHA', 'KEERTHI', 'MEGHANA', 'NISHITHA', 'PRATHIBHA', 'SNEHA'
];

const LAST_NAMES = [
  'GOWDA', 'KUMAR', 'PATEL', 'SHETTY', 'RAO', 'SHARMA', 'SINGH', 'DESHMUKH',
  'MUDIGOUDRA', 'B S', 'H M', 'M GOWDA', 'RATHOD', 'HIREMATH', 'INGALAGI',
  'YADAV', 'PARUK', 'KATYARMAL', 'GUPTA', 'ALUR', 'NAIK', 'KULKARNI', 'JOSHI'
];

const MENTORS = [
  'Dr. R. S. Kadadevarmath', 'Dr. K. N. Subramanya', 'Dr. H. S. Jayanna',
  'Dr. N. R. Sunitha', 'Dr. M. B. Nirmala', 'Dr. T. R. Dinesh', 'Dr. C. P. Chandrashekar',
  'Dr. S. V. Dinesh', 'Dr. M. A. Jayaram', 'Dr. G. T. Chandrappa'
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
  console.log('🚀 Generating Multi-Batch (2022-2026, 2023-2027, 2024-2028, 2025-2029) Synthetic Dataset...');

  console.log('Clearing existing database tables...');
  await prisma.subjectResult.deleteMany({});
  await prisma.semesterResult.deleteMany({});
  await prisma.backlog.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.batch.deleteMany({});

  // 1. Batches Config
  const batchesConfig = [
    { name: '2022-2026', startYear: 2022, endYear: 2026, prefix: '22', activeSemesters: 8 },
    { name: '2023-2027', startYear: 2023, endYear: 2027, prefix: '23', activeSemesters: 6 },
    { name: '2024-2028', startYear: 2024, endYear: 2028, prefix: '24', activeSemesters: 4 },
    { name: '2025-2029', startYear: 2025, endYear: 2029, prefix: '25', activeSemesters: 2 },
  ];

  const batchDbMap = new Map<string, any>();
  for (const b of batchesConfig) {
    const bObj = await prisma.batch.create({
      data: { name: b.name, startYear: b.startYear, endYear: b.endYear }
    });
    batchDbMap.set(b.name, bObj);
  }

  // 2. Branches Config
  const branchesConfig = [
    { code: 'CS', name: 'Computer Science & Engineering', count: 180, sections: ['A', 'B', 'C'] },
    { code: 'IS', name: 'Information Science & Engineering', count: 120, sections: ['A', 'B'] },
    { code: 'AD', name: 'Artificial Intelligence & Data Science', count: 60, sections: ['A'] },
    { code: 'CI', name: 'Artificial Intelligence & Machine Learning', count: 60, sections: ['A'] },
    { code: 'EC', name: 'Electronics & Communication Engineering', count: 120, sections: ['A', 'B'] },
    { code: 'ME', name: 'Mechanical Engineering', count: 60, sections: ['A'] },
    { code: 'CV', name: 'Civil Engineering', count: 60, sections: ['A'] },
  ];

  const branchDbMap = new Map<string, any>();
  for (const br of branchesConfig) {
    const brObj = await prisma.branch.create({
      data: { code: br.code, name: br.name }
    });
    branchDbMap.set(br.code, brObj);
  }

  // 3. Semesters (Sem 1 to Sem 8)
  const semestersConfig = [
    { number: 1, term: 'ODD 2024-25', academicYear: '2024-25', type: 'ODD' },
    { number: 2, term: 'EVEN 2024-25', academicYear: '2024-25', type: 'EVEN' },
    { number: 3, term: 'ODD 2025-26', academicYear: '2025-26', type: 'ODD' },
    { number: 4, term: 'EVEN 2025-26', academicYear: '2025-26', type: 'EVEN' },
    { number: 5, term: 'ODD 2026-27', academicYear: '2026-27', type: 'ODD' },
    { number: 6, term: 'EVEN 2026-27', academicYear: '2026-27', type: 'EVEN' },
    { number: 7, term: 'ODD 2027-28', academicYear: '2027-28', type: 'ODD' },
    { number: 8, term: 'EVEN 2027-28', academicYear: '2027-28', type: 'EVEN' },
  ];

  const semesterDbMap = new Map<number, any>();
  for (const s of semestersConfig) {
    const semObj = await prisma.semester.create({ data: s });
    semesterDbMap.set(s.number, semObj);
  }

  // 4. Curriculum Courses per Semester
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
    ],
    5: [
      { code: 'S5CCS01', name: 'COMPUTER NETWORKS & COMMUNICATIONS', credits: 4 },
      { code: 'S5CCS02', name: 'DATABASE MANAGEMENT SYSTEMS', credits: 4 },
      { code: 'S5CCS03', name: 'SOFTWARE ENGINEERING & AGILE ARCHITECTURE', credits: 3 },
      { code: 'S5CCS04', name: 'FULL STACK WEB DEVELOPMENT', credits: 3 },
      { code: 'S5CCS05', name: 'SYSTEM SOFTWARE & COMPILER PRINCIPLES', credits: 3 },
      { code: 'S5CCSL01', name: 'COMPUTER NETWORKS LABORATORY', credits: 1 },
      { code: 'S5CCSL02', name: 'DBMS & SQL LABORATORY', credits: 1 },
      { code: 'SHS03', name: 'QUANTITATIVE APTITUDE & REASONING', credits: 1 },
    ],
    6: [
      { code: 'S6CCS01', name: 'MACHINE LEARNING ALGORITHMS', credits: 4 },
      { code: 'S6CCS02', name: 'CLOUD COMPUTING & VIRTUALIZATION', credits: 4 },
      { code: 'S6CCS03', name: 'CYBER SECURITY & CRYPTOGRAPHY', credits: 3 },
      { code: 'S6PE01', name: 'PROFESSIONAL ELECTIVE I: AI ARCHITECTURES', credits: 3 },
      { code: 'S6PE02', name: 'PROFESSIONAL ELECTIVE II: MOBILE APPLICATION DEV', credits: 3 },
      { code: 'S6CCSL01', name: 'MACHINE LEARNING LABORATORY', credits: 1 },
      { code: 'S6MP01', name: 'MINI PROJECT WITH DESIGN THINKING', credits: 1 },
      { code: 'SHS04', name: 'RESEARCH METHODOLOGY & IPR', credits: 1 },
    ],
    7: [
      { code: 'S7CCS01', name: 'DEEP LEARNING & NEURAL NETWORKS', credits: 4 },
      { code: 'S7CCS02', name: 'BIG DATA ANALYTICS & HADOOP', credits: 4 },
      { code: 'S7PE03', name: 'PROFESSIONAL ELECTIVE III: BLOCKCHAIN TECH', credits: 3 },
      { code: 'S7OE01', name: 'OPEN ELECTIVE I: QUANTUM COMPUTING', credits: 3 },
      { code: 'S7PJ01', name: 'MAJOR PROJECT PHASE 1', credits: 3 },
      { code: 'S7INT01', name: 'SUMMER INTERNSHIP REPORT & VIVA', credits: 2 },
      { code: 'S7CCSL01', name: 'DEEP LEARNING LABORATORY', credits: 1 },
      { code: 'SHS05', name: 'TECHNICAL SEMINAR', credits: 1 },
    ],
    8: [
      { code: 'S8PJ02', name: 'MAJOR PROJECT PHASE 2 & DISSERTATION', credits: 12 },
      { code: 'S8PE04', name: 'PROFESSIONAL ELECTIVE IV: ADVANCED NLP', credits: 3 },
      { code: 'S8OE02', name: 'OPEN ELECTIVE II: ENTREPRENEURSHIP', credits: 3 },
      { code: 'S8SEM01', name: 'COMPREHENSIVE VIVA VOCE', credits: 2 },
    ]
  };

  const subjectDbMap = new Map<string, any>();
  for (const semNum of [1, 2, 3, 4, 5, 6, 7, 8]) {
    for (const c of curriculum[semNum]) {
      const subjObj = await prisma.subject.upsert({
        where: { courseCode: c.code },
        update: { name: c.name, defaultCredits: c.credits },
        create: { courseCode: c.code, name: c.name, defaultCredits: c.credits },
      });
      subjectDbMap.set(c.code, subjObj);
    }
  }

  // 5. Generate Students Across All Batches & Branches
  let totalStudentCount = 0;

  for (const bConfig of batchesConfig) {
    const batchDb = batchDbMap.get(bConfig.name);

    for (const brConfig of branchesConfig) {
      const branchDb = branchDbMap.get(brConfig.code);
      console.log(`Generating Batch ${bConfig.name} - ${brConfig.code} (${brConfig.count} students)...`);

      const studentsToCreate: any[] = [];
      const secSize = Math.ceil(brConfig.count / brConfig.sections.length);

      for (let i = 1; i <= brConfig.count; i++) {
        const isMale = Math.random() > 0.45;
        const firstName = getRandomElement(isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
        const lastName = getRandomElement(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;

        // USN divided by year: 1SI22CS001, 1SI23CS001, 1SI24CS001, 1SI25CS001
        const numStr = String(i).padStart(3, '0');
        const usn = `1SI${bConfig.prefix}${brConfig.code}${numStr}`;

        // Sections divided by USN range/first letter
        const secIdx = Math.min(Math.floor((i - 1) / secSize), brConfig.sections.length - 1);
        const section = brConfig.sections[secIdx];

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
          batchId: batchDb.id,
          branchId: branchDb.id,
          email,
          phone,
          mentorName,
          admissionType,
          bloodGroup,
          creditsEarned: bConfig.activeSemesters * 20,
          creditsToEarn: 160 - (bConfig.activeSemesters * 20),
          overallCgpa: 0.0
        });

        totalStudentCount++;
      }

      await prisma.student.createMany({ data: studentsToCreate });
    }
  }

  // Fetch all DB Students
  const allDbStudents = await prisma.student.findMany({
    include: { batch: true, branch: true }
  });

  console.log(`Created ${allDbStudents.length} total students across all batches. Generating Results...`);

  const semesterResultsToInsert: any[] = [];
  const subjectResultsToInsert: any[] = [];
  const backlogEntriesToInsert: any[] = [];

  const studentSemPerformance: Record<number, Record<number, { studentId: number; section: string; branchId: number; batchId: number; sgpa: number; cgpa: number; creditsEarned: number }>> = {};

  for (const student of allDbStudents) {
    const batchInfo = batchesConfig.find(b => b.name === student.batch.name)!;
    const activeSemesters = batchInfo.activeSemesters;

    let cumulativePoints = 0;
    let cumulativeCredits = 0;

    studentSemPerformance[student.id] = {};

    for (let semNum = 1; semNum <= activeSemesters; semNum++) {
      const semDb = semesterDbMap.get(semNum);
      const subjects = curriculum[semNum];

      let semPoints = 0;
      let semCreditsReg = 0;
      let semCreditsEarned = 0;

      for (const c of subjects) {
        const subjDb = subjectDbMap.get(c.code);
        const credits = c.credits;

        const baseGpa = getRandomFloat(5.0, 9.9, 1);
        const { grade, gradePoint } = calculateGrade(baseGpa);
        const isFail = grade === 'F';

        const cieMarks = getRandomInt(26, 49);
        const seeMarks = isFail ? getRandomInt(15, 35) : getRandomInt(48, 98);
        const assignmentMarks = getRandomInt(8, 10);
        const attendance = getRandomInt(83, 100);

        const creditsEarned = isFail ? 0 : credits;
        semCreditsReg += credits;
        semCreditsEarned += creditsEarned;

        semPoints += gradePoint * credits;

        const isRetake = Math.random() < 0.04;

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

        if (isFail && !isRetake) {
          backlogEntriesToInsert.push({
            studentId: student.id,
            subjectId: subjDb.id,
            attempts: 1
          });
        }
      }

      cumulativePoints += semPoints;
      cumulativeCredits += semCreditsReg;

      const sgpa = Number((semPoints / semCreditsReg).toFixed(2));
      const cgpa = Number((cumulativePoints / cumulativeCredits).toFixed(2));

      studentSemPerformance[student.id][semNum] = {
        studentId: student.id,
        section: student.section || 'A',
        branchId: student.branchId,
        batchId: student.batchId,
        sgpa,
        cgpa,
        creditsEarned: semCreditsEarned
      };
    }
  }

  // Calculate Ranks per Batch per Branch per Semester per Section
  console.log('Calculating Section Ranks & Branch Ranks across all batches...');

  for (const bConfig of batchesConfig) {
    const batchDb = batchDbMap.get(bConfig.name);

    for (let semNum = 1; semNum <= bConfig.activeSemesters; semNum++) {
      const semDb = semesterDbMap.get(semNum);

      const branchGroups = new Map<number, any[]>();
      for (const studentId in studentSemPerformance) {
        const perf = studentSemPerformance[studentId][semNum];
        if (perf && perf.batchId === batchDb.id) {
          if (!branchGroups.has(perf.branchId)) branchGroups.set(perf.branchId, []);
          branchGroups.get(perf.branchId)!.push(perf);
        }
      }

      for (const [branchId, branchPerfs] of branchGroups.entries()) {
        branchPerfs.sort((a, b) => b.cgpa - a.cgpa);
        branchPerfs.forEach((p, idx) => { p.rankInBranch = idx + 1; });

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
            totalAttendance: getRandomFloat(87.0, 98.5, 1)
          });
        }
      }
    }
  }

  console.log(`Bulk inserting ${semesterResultsToInsert.length} Semester Results...`);
  await prisma.semesterResult.createMany({ data: semesterResultsToInsert });

  console.log(`Bulk inserting ${subjectResultsToInsert.length} Subject Results...`);
  await prisma.subjectResult.createMany({ data: subjectResultsToInsert });

  console.log(`Bulk inserting ${backlogEntriesToInsert.length} Backlog Entries...`);
  const backlogMap = new Map<string, any>();
  for (const b of backlogEntriesToInsert) {
    const k = `${b.studentId}_${b.subjectId}`;
    if (!backlogMap.has(k)) backlogMap.set(k, b);
  }
  await prisma.backlog.createMany({ data: Array.from(backlogMap.values()) });

  console.log('Updating overall student CGPAs...');
  for (const studentId in studentSemPerformance) {
    const perfs = studentSemPerformance[studentId];
    const maxSem = Math.max(...Object.keys(perfs).map(Number));
    const finalCgpa = perfs[maxSem].cgpa;
    await prisma.student.update({
      where: { id: Number(studentId) },
      data: { overallCgpa: finalCgpa }
    });
  }

  console.log('🎉 Multi-Batch & Multi-Branch Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
