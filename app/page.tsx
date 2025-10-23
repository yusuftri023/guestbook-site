"use client";

import { CameraComponent } from "@/components/shared/camera/camera";
import QRComponent from "@/components/shared/qr-scanner/qr-component";
import Link from "next/link";

import { z } from "zod";

const searchSchema = z.object({
  search: z.string(),
});
export type SearchForm = z.infer<typeof searchSchema>;
export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center space-y-4 bg-gray-100">
      <Link href={"/check-in"}>
        <button className="w-[300px] rounded-md bg-blue-500 px-4 py-3 text-xl text-white">
          Check-in
        </button>
      </Link>
      <Link href={"/gift"}>
        <button className="w-[300px] rounded-md bg-blue-500 px-4 py-3 text-xl text-white">
          Ambil suvenir
        </button>
      </Link>
      <Link href={"/message"}>
        <button className="w-[300px] rounded-md bg-blue-500 px-4 py-3 text-xl text-white">
          Tulis Pesan
        </button>
      </Link>
      <Link href={"/board/welcome"}>
        <button className="w-[300px] rounded-md bg-blue-500 px-4 py-3 text-xl text-white">
          Layar datang
        </button>
      </Link>
      <Link href={"/attendees-count"}>
        <button className="w-[300px] rounded-md bg-blue-500 px-4 py-3 text-xl text-white">
          Check Jumlah Hadir
        </button>
      </Link>
    </div>
  );
}
