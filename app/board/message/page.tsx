"use client";

import DigitalClock from "@/components/shared/digital-clock";
import { Message } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timerId = setInterval(async () => {
      await axios
        .get("/api/messages")
        .then((res) => {
          setMessages(res.data);
        })
        .catch(() => {
          console.log("connection error");
        });
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, [messages]);
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100">
      <h1 className="mt-20 text-4xl font-bold text-gray-800">
        Pesan dari tamu
      </h1>
      <div className="mt-4 w-[400px] space-y-4 pb-20 sm:w-[600px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="rounded-lg border border-gray-300 bg-white p-4 shadow"
          >
            <h2 className="text-2xl font-semibold text-gray-700">{msg.name}</h2>
            <p className="mt-2 text-lg text-gray-600">{msg.content}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
            <p className="text-lg text-gray-600">Belum ada pesan.</p>
          </div>
        )}
      </div>
      <div className="absolute right-2 top-2 text-xl">
        <DigitalClock />
      </div>
    </div>
  );
}
