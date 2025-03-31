import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: 단일 habit 습관 조회
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      return NextResponse.json(
        { error: '습관을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Habit 조회 에러:', error);
    return NextResponse.json(
      { error: '습관을 가져오는데 실패했습니다.' },
      { status: 500 },
    );
  }
}

// PATCH: 습관 수정
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 403 });
  }

  try {
    const { id } = params;
    const { title, notes, categories, repeats, lastCompleted } =
      await request.json();

    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      return NextResponse.json(
        { error: '습관을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json(
        { error: '이 습관을 수정할 권한이 없습니다.' },
        { status: 403 },
      );
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(notes !== undefined && { notes }),
        ...(categories !== undefined && { categories }),
        ...(repeats !== undefined && { repeats }),
        ...(lastCompleted !== undefined && {
          lastCompleted: new Date(lastCompleted),
        }),
      },
    });

    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error('Habit 수정 에러:', error);
    return NextResponse.json(
      { error: '습관 수정에 실패했습니다.' },
      { status: 500 },
    );
  }
}

// DELETE: 습관 삭제
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 403 });
  }

  try {
    const { id } = params;

    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      return NextResponse.json(
        { error: '습관을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json(
        { error: '이 습관을 삭제할 권한이 없습니다.' },
        { status: 403 },
      );
    }

    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ message: '습관이 삭제되었습니다.' });
  } catch (error) {
    console.error('Habit 삭제 에러:', error);
    return NextResponse.json(
      { error: '습관 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
