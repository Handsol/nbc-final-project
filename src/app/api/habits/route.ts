import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

// GET: 모든 습관 조회
export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error('Habit 조회 에러:', error);
    return NextResponse.json(
      { error: '습관 목록을 가져오는데 실패했습니다.' },
      { status: 500 },
    );
  }
}

// POST: 새 습관 생성 (로그인 필요)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 403 });
  }

  try {
    const { title, notes, categories, repeats } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: '제목은 필수입니다.' },
        { status: 400 },
      );
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        notes,
        categories,
        repeats: repeats || '[]',
        userId: session.user.id,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error('Habit 생성 에러:', error);
    return NextResponse.json(
      { error: '습관 생성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
