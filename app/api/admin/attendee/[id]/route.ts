import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Attendee } from "@prisma/client";

// POST /api/admin/attendee/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (
      !body.name ||
      !body.phone_number ||
      !body.location ||
      body.is_amplop === undefined
    ) {
      return NextResponse.json(
        { code: "BAD_REQUEST", message: "Missing required fields" },
        { status: 400 },
      );
    }
    console.log(body.is_amplop);
    const attendee = await prisma.attendee.findUnique({
      where: { id },
    });
    if (!attendee) {
      return NextResponse.json(
        { code: "NOT_FOUND", message: "Attendee not found" },
        { status: 404 },
      );
    }
    const updatedAttendee = await prisma.attendee.update({
      where: { id },
      data: {
        name: body.name,
        phone_number: body.phone_number,
        location: body.location,
        is_amplop: body.is_amplop,
      },
    });
    return NextResponse.json(updatedAttendee, { status: 200 });
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
