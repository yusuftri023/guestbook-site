"use client";
import DigitalClock from "@/components/shared/digital-clock";
import axios from "axios";
import { useEffect, useState } from "react";

export default function WelcomeBoard() {
  const [currentAttendee, setCurrentAttendee] = useState<string>("********");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    const timerId = setInterval(async () => {
      await axios
        .get("/api/attendee/welcome")
        .then((res) => {
          if (currentAttendee !== res.data.name) {
            setCurrentAttendee(res.data.name);
            if (audio) {
              audio.currentTime = 0;
              audio.play().catch((err) => console.log(err));
            }
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
  useEffect(() => {
    setAudio(new Audio("/sounds/bell.mp3"));
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800">
        Selamat Datang di Acara kami saudara/i
      </h1>
      <h1 className="my-4 text-4xl font-bold text-gray-800">{`${currentAttendee} sekeluarga!`}</h1>
      <p className="mt-4 text-lg text-gray-600">
        Terima kasih telah bergabung dengan kami hari ini. Kami sangat senang
        menyambut Anda di acara spesial ini.
      </p>
      <div className="absolute right-2 top-2 text-xl">
        <DigitalClock />
      </div>
    </div>
  );
}
