import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ usn: string }> }
) {
  try {
    const { usn } = await params;
    const studentUsn = usn.toUpperCase();

    const student = await prisma.student.findFirst({
      where: { usn: studentUsn },
      include: {
        batch: true,
        branch: true,
        semesterResults: {
          include: { semester: true },
          orderBy: { semester: { number: 'asc' } }
        },
        subjectResults: {
          include: { subject: true, semester: true },
          orderBy: { semester: { number: 'asc' } }
        },
        backlogs: {
          include: { subject: true }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const allSemResults = await prisma.semesterResult.findMany({
      where: {
        student: {
          batchId: student.batchId,
          branchId: student.branchId
        }
      },
      include: { semester: true }
    });

    const classAverages: Record<number, { sgpa: number; count: number }> = {};
    for (const r of allSemResults) {
      if (r.sgpa !== null) {
        const semNum = r.semester.number;
        if (!classAverages[semNum]) classAverages[semNum] = { sgpa: 0, count: 0 };
        classAverages[semNum].sgpa += r.sgpa;
        classAverages[semNum].count++;
      }
    }

    const averagesBySem = Object.fromEntries(
      Object.entries(classAverages).map(([sem, data]) => [
        sem,
        data.sgpa / data.count
      ])
    );

    return NextResponse.json({
      student,
      classAverages: averagesBySem
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
