"use client";
import QRComponent from "@/components/shared/qr-scanner/qr-component";
import { Attendee } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Message() {
  const menu = ["qr", "manual"] as const;

  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-100">
      <div className="absolute top-4 overflow-hidden rounded-lg bg-white shadow-md sm:left-4 sm:top-4"></div>

      <div className="flex flex-col items-center py-12">
        <h2 className="py-8 text-center text-4xl">
          Tulis pesan dan doa untuk pengantin
        </h2>
        <input
          type="text"
          placeholder="Nama penulis pesan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[400px] rounded-md border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none sm:w-[600px]"
        />
        <textarea
          placeholder="Isi pesan dan doa Anda di sini..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-6 w-[400px] rounded-md border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none sm:w-[600px]"
        />
        <button
          onClick={() => {
            setIsLoading(true);
            axios
              .post("/api/message", { name, content })
              .then((res) => {
                toast(res.data.message, { type: "success" });
                setName("");
                setContent("");
              })
              .catch((err: AxiosError<{ message: string }>) => {
                toast(err.response?.data.message || "Gagal mengirim pesan", {
                  type: "error",
                });
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
          className="mt-6 w-[400px] rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-500 sm:w-[600px]"
          disabled={isLoading || name === "" || content === ""}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
