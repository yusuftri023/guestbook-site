import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/message
export async function GET(req: NextRequest) {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        created_at: "asc",
      },
    });

    return NextResponse.json(messages, { status: 200 });
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
