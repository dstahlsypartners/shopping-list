import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, quantity, category } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const list = await prisma.list.findUnique({
      where: { id: params.id }
    });

    if (!list) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "List not found" },
        { status: 404 }
      );
    }

    const item = await prisma.item.create({
      data: {
        name: name.trim(),
        quantity: quantity || 1,
        category: category?.trim() || null,
        listId: params.id
      }
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create item:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
} 