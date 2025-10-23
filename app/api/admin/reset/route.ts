import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/admin/reset
// Reset all attendee presence and gift status
export async function PUT(req: NextRequest) {
  try {
    await prisma.attendee.updateMany({
      data: {
        is_present: false,
        present_at: null,
        is_gift_taken: false,
        gift_taken_at: null,
      },
    });
    return NextResponse.json(
      { message: "Data berhasil direset" },
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
