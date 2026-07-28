import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeStats, getGradeBands, getDistribution } from '@/lib/stats';

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
      },
      include: {
        student: true
      }
    });

    const cgpas = semesterResults.map(r => r.cgpa).filter((val): val is number => val !== null && val > 0);
    const sgpas = semesterResults.map(r => r.sgpa).filter((val): val is number => val !== null && val > 0);

    const cgpaStats = computeStats(cgpas);
    const sgpaStats = computeStats(sgpas);
    const cgpaBands = getGradeBands(cgpas);
    const sgpaBands = getGradeBands(sgpas);
    const cgpaDistribution = getDistribution(cgpas);
    const sgpaDistribution = getDistribution(sgpas);

    // Section-wise analysis (Section A vs Section B vs Section C)
    const sectionGroups = new Map<string, { cgpas: number[]; sgpas: number[]; passed: number; failed: number }>();
    
    for (const r of semesterResults) {
      const sec = r.student.section || 'A';
      if (!sectionGroups.has(sec)) {
        sectionGroups.set(sec, { cgpas: [], sgpas: [], passed: 0, failed: 0 });
      }
      const g = sectionGroups.get(sec)!;
      if (r.cgpa !== null && r.cgpa > 0) g.cgpas.push(r.cgpa);
      if (r.sgpa !== null && r.sgpa > 0) g.sgpas.push(r.sgpa);
      if (r.creditsEarned >= r.creditsRegistered) g.passed++;
      else g.failed++;
    }

    const sectionStats = Array.from(sectionGroups.entries()).map(([section, data]) => {
      const avgCgpa = data.cgpas.length ? data.cgpas.reduce((a, b) => a + b, 0) / data.cgpas.length : 0;
      const avgSgpa = data.sgpas.length ? data.sgpas.reduce((a, b) => a + b, 0) / data.sgpas.length : 0;
      const topCgpa = data.cgpas.length ? Math.max(...data.cgpas) : 0;
      const topSgpa = data.sgpas.length ? Math.max(...data.sgpas) : 0;
      const total = data.passed + data.failed;

      return {
        section,
        count: total,
        avgCgpa: Number(avgCgpa.toFixed(2)),
        avgSgpa: Number(avgSgpa.toFixed(2)),
        topCgpa: Number(topCgpa.toFixed(2)),
        topSgpa: Number(topSgpa.toFixed(2))
      };
    }).sort((a, b) => a.section.localeCompare(b.section));

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
      
      if (['F', 'DX', 'NE', 'AB', 'NP'].includes(sr.grade)) group.failed++;
      else group.passed++;
    }

    const subjectStats = Array.from(subjectGroups.values()).map(group => {
      const avgGpa = group.gpas.length ? group.gpas.reduce((a: number, b: number) => a + b, 0) / group.gpas.length : 0;
      const avgCie = group.cieMarks.length ? group.cieMarks.reduce((a: number, b: number) => a + b, 0) / group.cieMarks.length : 0;
      const avgAtt = group.attendances.length ? group.attendances.reduce((a: number, b: number) => a + b, 0) / group.attendances.length : 0;

      return {
        subject: group.subject,
        avgGpa: Number(avgGpa.toFixed(2)),
        avgCie: Number(avgCie.toFixed(1)),
        avgAttendance: Number(avgAtt.toFixed(1)),
        passed: group.passed,
        failed: group.failed,
        total: group.passed + group.failed
      };
    });

    return NextResponse.json({
      cgpa: { stats: cgpaStats, gradeBands: cgpaBands, distribution: cgpaDistribution },
      sgpa: { stats: sgpaStats, gradeBands: sgpaBands, distribution: sgpaDistribution },
      totalStudents: semesterResults.length,
      sectionStats,
      subjectStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
