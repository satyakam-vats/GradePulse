import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ batch: string; branch: string; sem: string }> }
) {
  try {
    const { batch: batchName, branch: branchCode, sem } = await params;
    const semesterNumber = parseInt(sem, 10);

    const { searchParams } = new URL(request.url);
    const filterSection = searchParams.get('section');

    const batch = await prisma.batch.findFirst({ where: { name: batchName } });
    const branch = await prisma.branch.findFirst({ where: { code: branchCode } });

    if (!batch || !branch || isNaN(semesterNumber)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const whereClause: any = {
      batchId: batch.id,
      branchId: branch.id,
      semesterResults: {
        some: {
          semester: {
            number: semesterNumber
          }
        }
      }
    };

    if (filterSection && filterSection !== 'ALL') {
      whereClause.section = filterSection.toUpperCase();
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        semesterResults: {
          where: {
            semester: {
              number: semesterNumber
            }
          }
        },
        subjectResults: {
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
      const activeBacklogs = student.subjectResults.filter(sr => ['F', 'DX', 'NE', 'AB', 'NP'].includes(sr.grade)).length;
      const clearedBacklogs = student.subjectResults.filter(sr => sr.backlogCleared).length;

      return {
        id: student.id,
        usn: student.usn,
        name: student.name,
        gender: student.gender,
        section: student.section || 'A',
        sgpa: semResult?.sgpa ?? null,
        cgpa: semResult?.cgpa ?? null,
        creditsEarned: semResult?.creditsEarned ?? null,
        creditsRegistered: semResult?.creditsRegistered ?? null,
        activeBacklogs,
        clearedBacklogs
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
