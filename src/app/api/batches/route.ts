import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: { _count: { select: { students: true } } }
    });
    return NextResponse.json(batches.map(b => ({
      id: b.id, name: b.name, startYear: b.startYear, endYear: b.endYear,
      studentCount: b._count.students
    })));
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}
