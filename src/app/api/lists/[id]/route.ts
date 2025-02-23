import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

export async function DELETE(
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

    const list = await prisma.list.findUnique({
      where: { id: params.id }
    });

    if (!list) {
      return NextResponse.json<ApiResponse<never>>(
        { error: "List not found" },
        { status: 404 }
      );
    }

    // Delete the list (items will be cascade deleted due to the relation config)
    await prisma.list.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("Failed to delete list:", error);
    return NextResponse.json<ApiResponse<never>>(
      { error: "Failed to delete list" },
      { status: 500 }
    );
  }
} 