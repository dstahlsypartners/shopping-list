import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, List } from "@/types/api";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const lists = await prisma.list.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const formattedLists: List[] = lists.map(list => ({
      id: list.id,
      title: list.title,
      itemCount: list._count.items,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString()
    }));

    return NextResponse.json<ApiResponse<List[]>>({ data: formattedLists });
  } catch (error) {
    console.error("Failed to fetch lists:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Failed to fetch lists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const list = await prisma.list.create({
      data: {
        title: title.trim(),
      }
    });

    return NextResponse.json<ApiResponse<List>>({
      data: {
        id: list.id,
        title: list.title,
        itemCount: 0,
        createdAt: list.createdAt.toISOString(),
        updatedAt: list.updatedAt.toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create list:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Failed to create list" },
      { status: 500 }
    );
  }
} 