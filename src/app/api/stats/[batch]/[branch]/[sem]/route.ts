import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeStats, getGradeBands, getPassFailRatio } from '@/lib/stats';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ batch: string; branch: string; sem: string }> }
) {
  try {
    const { batch: batchName, branch: branchCode, sem } = await params;
    const semesterNumber = parseInt(sem, 10);

    const batch = await prisma.batch.findFirst({ where: { name: batchName } });
    const branch = await prisma.branch.findFirst({ where: { code: branchCode } });

    if (!batch || !branch || isNaN(semesterNumber)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const semesterResults = await prisma.semesterResult.findMany({
      where: {
        semester: { number: semesterNumber },
        student: { batchId: batch.id, branchId: branch.id }
      }
    });

    const cgpas = semesterResults.map(r => r.cgpa).filter((val): val is number => val !== null);
    const sgpas = semesterResults.map(r => r.sgpa).filter((val): val is number => val !== null);

    const cgpaStats = computeStats(cgpas);
    const sgpaStats = computeStats(sgpas);
    const gradeBands = getGradeBands(cgpas);
    const passFail = getPassFailRatio(
      semesterResults.map(r => r.creditsRegistered),
      semesterResults.map(r => r.creditsEarned)
    );

    const subjectResults = await prisma.subjectResult.findMany({
      where: {
        semester: { number: semesterNumber },
        student: { batchId: batch.id, branchId: branch.id }
      },
      include: {
        subject: true
      }
    });

    const subjectGroups = new Map<number, any>();
    for (const sr of subjectResults) {
      const subId = sr.subject.id;
      if (!subjectGroups.has(subId)) {
        subjectGroups.set(subId, {
          subject: sr.subject,
          gpas: [],
          cieMarks: [],
          attendances: [],
          passed: 0,
          failed: 0
        });
      }
      const group = subjectGroups.get(subId);
      if (sr.gpa !== null) group.gpas.push(sr.gpa);
      if (sr.cieMarks !== null) group.cieMarks.push(sr.cieMarks);
      if (sr.attendance !== null) group.attendances.push(sr.attendance);
      
      if (sr.grade === 'F') group.failed++;
      else group.passed++;
    }

    const subjectStats = Array.from(subjectGroups.values()).map(group => {
      const avgGpa = group.gpas.length ? group.gpas.reduce((a: number, b: number) => a + b, 0) / group.gpas.length : 0;
      const avgCie = group.cieMarks.length ? group.cieMarks.reduce((a: number, b: number) => a + b, 0) / group.cieMarks.length : 0;
      const avgAtt = group.attendances.length ? group.attendances.reduce((a: number, b: number) => a + b, 0) / group.attendances.length : 0;

      return {
        subject: group.subject,
        avgGpa,
        avgCie,
        avgAttendance: avgAtt,
        passed: group.passed,
        failed: group.failed,
        total: group.passed + group.failed
      };
    });

    return NextResponse.json({
      cgpa: { stats: cgpaStats, gradeBands },
      sgpa: { stats: sgpaStats },
      passRate: passFail,
      totalStudents: semesterResults.length,
      subjectStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
