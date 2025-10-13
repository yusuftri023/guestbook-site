import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Attendee } from "@prisma/client";

// POST /api/admin/attendees
export async function POST(req: NextRequest) {
  try {
    const data: {
      name: string;
      location: string;
      phone_number: string;
      cash_amount: number;
      is_amplop: boolean;
    } = await req.json();
    if (
      !data ||
      !data.name ||
      !data.location ||
      !data.phone_number ||
      data.is_amplop === undefined
    ) {
      return NextResponse.json(
        {
          code: "INVALID",
          error: "Invalid data",
          message: "Data tidak valid",
        },
        { status: 400 },
      );
    }
    if (data.phone_number.startsWith("0")) {
      data.phone_number = "62" + String(data.phone_number).substring(1);
    }
    const attendees = await prisma.attendee.createMany({
      data,
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
