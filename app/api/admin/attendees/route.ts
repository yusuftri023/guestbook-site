import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Attendee } from "@prisma/client";

// GET /api/admin/attendees
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
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        data: attendees,
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

// POST /api/admin/attendees
export async function POST(req: NextRequest) {
  try {
    const data: {
      data: {
        Nama: string;
        Lokasi: string;
        "Nomor Telefon"?: string;
      }[];
    } = await req.json();
    console.log(data);
    const newData = data.data.map((attendee) => ({
      name: attendee.Nama,
      location: attendee.Lokasi,
      phone_number: attendee["Nomor Telefon"]
        ? attendee["Nomor Telefon"]
        : String(Math.floor(Math.random() * 1000000000)),
    }));
    await prisma.attendee.deleteMany();
    await prisma.attendee.createMany({
      data: newData,
    });

    return NextResponse.json(
      { message: "Data berhasil diunggah" },
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
