import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET: 모든 Todo 항목 조회
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Todo 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST: 새 Todo 항목 생성 (로그인 필요)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // 인증되지 않은 사용자는 403 에러
  if (!session || !session.user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 403 });
  }

  try {
    const { title, content } = await request.json();

    // 필수 필드 확인
    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수입니다." },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        content,
        userId: session.user.id
      }
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Todo 항목 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
