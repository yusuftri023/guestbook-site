import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/attendee/:id/check-in
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const attendee = await prisma.attendee.findFirst({
      where: {
        id: (await params).id,
      },
      select: { id: true, name: true, is_present: true },
    });
    if (!attendee) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          error: "No attendee found",
          message: "Tamu tidak ditemukan atau tamu tersebut sudah check-in",
        },
        { status: 404 },
      );
    }
    if (attendee.is_present) {
      return NextResponse.json(
        {
          code: "ALREADY_CHECKED_IN",
          error: "Attendee already checked in",
          message: `Tamu keluarga ${attendee.name} sudah melakukan Check-in sebelumnya`,
        },
        { status: 400 },
      );
    }
    await prisma.attendee.update({
      where: { id: attendee.id },
      data: { is_present: true, present_at: new Date() },
    });
    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Check-in berhasil, terima kasih atas kehadirannya.",
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
