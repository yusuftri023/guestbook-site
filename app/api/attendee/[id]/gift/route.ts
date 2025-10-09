import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/attendee/:id/gift
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const attendee = await prisma.attendee.findFirst({
      where: {
        id: (await params).id,
      },
      select: { id: true, name: true, is_gift_taken: true },
    });
    if (!attendee) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          error: "No attendee found",
          message:
            "Tamu tidak ditemukan atau tamu tersebut sudah mengambil suvenir",
        },
        { status: 404 },
      );
    }
    if (attendee.is_gift_taken) {
      return NextResponse.json(
        {
          code: "ALREAD_TAKEN",
          error: "attendee already taken gift",
          message: `Tamu keluarga ${attendee.name} sudah mengambil suvenir sebelumnya`,
        },
        { status: 400 },
      );
    }
    await prisma.attendee.update({
      where: { id: attendee.id },
      data: { is_gift_taken: true, gift_taken_at: new Date() },
    });
    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Tamu ditemukan, silahkan mengambil suvenir",
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
