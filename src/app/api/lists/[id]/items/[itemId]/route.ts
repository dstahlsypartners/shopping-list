import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const item = await prisma.item.findUnique({
      where: {
        id: params.itemId,
        listId: params.id
      }
    });

    if (!item) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    await prisma.item.delete({
      where: { id: params.itemId }
    });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
} 