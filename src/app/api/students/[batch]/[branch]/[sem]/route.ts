import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const students = await prisma.student.findMany({
      where: {
        batchId: batch.id,
        branchId: branch.id,
        semesterResults: {
          some: {
            semester: {
              number: semesterNumber
            }
          }
        }
      },
      include: {
        semesterResults: {
          where: {
            semester: {
              number: semesterNumber
            }
          }
        }
      }
    });

    const result = students.map(student => {
      const semResult = student.semesterResults[0];
      return {
        id: student.id,
        usn: student.usn,
        name: student.name,
        gender: student.gender,
        sgpa: semResult?.sgpa ?? null,
        cgpa: semResult?.cgpa ?? null,
        creditsEarned: semResult?.creditsEarned ?? null,
        creditsRegistered: semResult?.creditsRegistered ?? null
      };
    }).sort((a, b) => {
      const cgpaA = a.cgpa ?? 0;
      const cgpaB = b.cgpa ?? 0;
      return cgpaB - cgpaA;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
