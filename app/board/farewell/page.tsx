"use client";
import DigitalClock from "@/components/shared/digital-clock";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FarewellBoard() {
  const [currentAttendee, setCurrentAttendee] = useState<string>("********");

  useEffect(() => {
    const audio = new Audio("/sounds/bell.mp3");
    const timerId = setInterval(async () => {
      await axios
        .get("/api/attendee/farewell")
        .then((res) => {
          if (currentAttendee !== res.data.name) {
            setCurrentAttendee(res.data.name);
            audio.currentTime = 0;
            audio.play().catch((err) => console.log(err));
          }
        })
        .catch(() => {
          console.log("connection error");
        });
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, [currentAttendee]);
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        Terima kasih atas kehadiran saudara/i
      </h1>
      <h1 className="my-4 text-4xl font-bold text-gray-800">{`${currentAttendee} sekeluarga!`}</h1>
      <p className="mt-4 text-lg text-gray-600">
        Kiranya perjalanan pulang Anda lancar dan selamat sampai tujuan. Sampai
        jumpa di lain kesempatan.
      </p>
      <div className="absolute right-2 top-2 text-xl">
        <DigitalClock />
      </div>
    </div>
  );
}
