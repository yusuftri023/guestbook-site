import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// GET /api/validation/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const attendee = await prisma.attendee.findFirst({
      where: {
        phone_number: (await params).id,
      },
      select: { id: true, name: true },
    });
    return NextResponse.json(
      {
        id: attendee?.id || "ID-123456",
        name: attendee?.name ? attendee.name + " Family" : "John Doe Family",
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
// PATCH /api/validation/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    console.log((await params).id);
    const attendee = await prisma.attendee.findFirst({
      where: {
        phone_number: (await params).id,
      },
      select: { id: true, name: true },
    });
    if (!attendee) {
      throw new Error("Tamu tidak terdaftar");
    }
    return NextResponse.json(
      {
        message: `Selamat datang di acara kami, keluarga ${attendee.name} ! terima kasih atas kehadirannya.`,
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
