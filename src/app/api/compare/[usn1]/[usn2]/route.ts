import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ usn1: string; usn2: string }> }
) {
  try {
    const { usn1, usn2 } = await params;

    const students = await prisma.student.findMany({
      where: {
        usn: {
          in: [usn1.toUpperCase(), usn2.toUpperCase()]
        }
      },
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
        }
      }
    });

    if (students.length !== 2) {
      return NextResponse.json({ error: 'One or both students not found' }, { status: 404 });
    }

    const student1 = students.find(s => s.usn === usn1.toUpperCase()) || students[0];
    const student2 = students.find(s => s.usn === usn2.toUpperCase()) || students[1];

    return NextResponse.json({
      student1,
      student2
    });
  } catch (error) {
    console.error('Error comparing students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
