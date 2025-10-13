"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import printPDF from "@/lib/print-pdf";

export default function QRComponent({ mode }: { mode: "check-in" | "gift" }) {
  const [stop, setStop] = useState(false);
  const handleStop = () => {
    setStop((prev) => !prev);
  };
  const printQR = async (text: string) => {
    printPDF(text);
    toast("Mencetak struk...", { type: "info" });
  };

  return (
    <div className="mx-auto flex h-auto w-[80%] flex-col items-center sm:h-[400px] sm:w-[400px]">
      <div className="relative h-auto w-[100%] sm:h-[300px] sm:w-[300px]">
        {stop && (
          <div className="absolute z-10 flex h-full w-full items-center bg-black text-center">
            <p className="w-full text-2xl text-white">Scanner Berhenti</p>
          </div>
        )}
        <Scanner
          scanDelay={1000}
          paused={stop}
          onScan={(result) => {
            if (result[0].rawValue) {
              axios
                .patch(`/api/attendee/${result[0].rawValue}/${mode}`)
                .then((res) => {
                  if (mode === "check-in") printQR(result[0].rawValue);
                  return toast(res.data.message, {
                    type: "success",
                  });
                })
                .catch(
                  (
                    err: AxiosError<{
                      message: string;
                    }>,
                  ) => {
                    return toast(
                      err.response?.data.message || "Undangan tidak terdaftar",
                      {
                        type: "error",
                      },
                    );
                  },
                );
            }
          }}
          allowMultiple
        />
      </div>
      <button
        className={
          (stop ? "bg-blue-500" : "bg-red-500") +
          " mt-2 place-items-center rounded-md border-[1px] px-4 py-2 text-white"
        }
        onClick={handleStop}
      >
        {stop ? "Start Scan" : "Stop Scan"}
      </button>
    </div>
  );
}
