import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ batch: string; branch: string }> }
) {
  try {
    const { batch: batchName, branch: branchCode } = await params;

    const batch = await prisma.batch.findFirst({ where: { name: batchName } });
    const branch = await prisma.branch.findFirst({ where: { code: branchCode } });

    if (!batch || !branch) {
      return NextResponse.json({ error: 'Batch or Branch not found' }, { status: 404 });
    }

    const semesters = await prisma.semester.findMany({
      where: {
        semesterResults: {
          some: {
            student: {
              batchId: batch.id,
              branchId: branch.id
            }
          }
        }
      },
      include: {
        semesterResults: {
          where: {
            student: {
              batchId: batch.id,
              branchId: branch.id
            }
          },
          select: {
            sgpa: true
          }
        }
      },
      orderBy: {
        number: 'asc'
      }
    });

    const result = semesters.map(sem => {
      const results = sem.semesterResults.filter(r => r.sgpa !== null);
      const avgSgpa = results.length > 0
        ? results.reduce((acc, curr) => acc + (curr.sgpa as number), 0) / results.length
        : null;

      return {
        id: sem.id,
        number: sem.number,
        term: sem.term,
        academicYear: sem.academicYear,
        type: sem.type,
        avgSgpa
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
