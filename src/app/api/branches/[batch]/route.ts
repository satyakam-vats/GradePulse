import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ batch: string }> }
) {
  try {
    const { batch: batchName } = await params;

    const batch = await prisma.batch.findFirst({
      where: { name: batchName }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const branches = await prisma.branch.findMany({
      where: {
        students: {
          some: {
            batchId: batch.id
          }
        }
      },
      include: {
        _count: {
          select: { students: { where: { batchId: batch.id } } }
        }
      }
    });

    const result = branches.map(b => ({
      ...b,
      studentCount: b._count.students
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
