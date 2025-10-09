import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/message
export async function POST(req: NextRequest) {
  try {
    const { name, content } = await req.json();
    if (!name || !content) {
      return NextResponse.json(
        {
          code: "ERROR",
          error: "Invalid",
          message: "Name and Message is required",
        },
        { status: 400 },
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        content,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          code: "ERROR",
          error: error.message,
          message: "INTERNAL SERVER ERROR",
        },
        { status: 500 },
      );
    }
  }
}
