"use client";
import { chetta, fortalesia } from "@/app/fonts";
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
    <div
      className="flex min-h-screen w-full flex-col items-center justify-start bg-bottom text-center"
      style={{
        background:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), url(/welcome-bg.JPEG) lightgray 50% / cover no-repeat",
      }}
    >
      <div className="mt-[6%] rounded-lg bg-white bg-opacity-65 p-4 md:p-8">
        <h2
          className={`text-2xl font-bold text-gray-800 md:text-4xl ${chetta.className}`}
        >
          Selamat Datang di Acara Ngunduh Mantu
        </h2>
        <h2
          className={`font-fortalesia my-4 text-2xl font-bold text-gray-800 md:text-4xl ${chetta.className}`}
        >
          FIO & ANGGI
        </h2>
        <h2
          className={`my-4 text-2xl font-bold text-gray-800 md:text-4xl ${chetta.className}`}
        >
          {`Bapak/Ibu/Saudara/i`}
        </h2>
        <h2
          className={`my-4 text-2xl font-bold text-gray-800 md:text-4xl ${chetta.className}`}
        >
          {`${currentAttendee}`}
        </h2>
      </div>

      <div className="fixed bottom-4 right-4 rounded-lg bg-white bg-opacity-50 p-2 text-xl md:bottom-8 md:right-8">
        <DigitalClock />
      </div>
    </div>
  );
}
