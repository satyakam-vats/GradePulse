const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const s = await prisma.student.findFirst({
    where: { usn: '1SI24CS179' },
    include: {
      subjectResults: {
        include: { subject: true, semester: true }
      },
      semesterResults: {
        include: { semester: true }
      }
    }
  });

  console.log('=== SUPREET 1SI24CS179 DB AUDIT ===');
  console.log('Student Name:', s.name);
  console.log('\nSemester Results:');
  s.semesterResults.forEach(sr => {
    console.log(` Sem ${sr.semester.number} (${sr.semester.term}): Reg Credits = ${sr.creditsRegistered}, Earned = ${sr.creditsEarned}, SGPA = ${sr.sgpa}, CGPA = ${sr.cgpa}`);
  });

  console.log('\nSemester 1 Subjects (Total: ' + s.subjectResults.filter(sub => sub.semester.number === 1).length + '):');
  s.subjectResults.filter(sub => sub.semester.number === 1).forEach(sub => {
    console.log(`  - [${sub.subject.courseCode}] ${sub.subject.name} (${sub.subject.defaultCredits} credits)`);
  });

  console.log('\nSemester 2 Subjects (Total: ' + s.subjectResults.filter(sub => sub.semester.number === 2).length + '):');
  s.subjectResults.filter(sub => sub.semester.number === 2).forEach(sub => {
    console.log(`  - [${sub.subject.courseCode}] ${sub.subject.name} (${sub.subject.defaultCredits} credits)`);
  });
}

main().then(() => prisma.$disconnect());
