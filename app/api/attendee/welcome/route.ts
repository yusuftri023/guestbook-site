import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/attendee/welcome
export async function GET(req: NextRequest) {
  try {
    const attendee = await prisma.attendee.findFirst({
      where: {
        is_present: true,
      },
      select: { id: true, name: true },
      orderBy: {
        present_at: "desc",
      },
    });
    return NextResponse.json(
      {
        id: attendee?.id || "ID-123456",
        name: attendee?.name ? attendee.name : "********",
      },
      { status: 200 },
    );
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
