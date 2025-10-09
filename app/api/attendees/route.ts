import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/attendees
export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || "";
    const attendees = await prisma.attendee.findMany({
      where: {
        name:
          search.length > 0
            ? { contains: search, mode: "insensitive" }
            : undefined,
      },
      take: 5,
    });

    return NextResponse.json(attendees, { status: 200 });
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
