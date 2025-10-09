"use client";
import QRComponent from "@/components/shared/qr-scanner/qr-component";
import printPDF from "@/lib/print-pdf";
import { Attendee } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CheckIn() {
  const menu = ["qr", "manual"] as const;

  const [searchResult, setSearchResult] = useState<Attendee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<"qr" | "manual">("qr");

  const handleMenu = (selection: "qr" | "manual") => {
    setActiveMenu(selection);
  };

  const handlePrint = (id: string) => {
    printPDF(id);
    toast("Mencetak struk...", { type: "info" });
  };
  useEffect(() => {
    axios
      .get(`/api/attendees?search=${search}`) // Example API endpoint
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch((err) => {
        console.error("Error fetching attendees:", err);
      });
  }, [search]);
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-100">
      <div className="absolute top-4 overflow-hidden rounded-lg bg-white shadow-md sm:left-4 sm:top-4">
        {menu.map((selection) => (
          <button
            key={selection}
            onClick={() => handleMenu(selection)}
            className={
              (activeMenu === selection ? "bg-blue-500 text-white" : "") +
              " px-4 py-2 text-xl"
            }
          >
            {selection === "qr" ? "Check-in QR" : "Check-in Manual"}
          </button>
        ))}
      </div>
      {activeMenu === "qr" ? (
        <div className="py-12">
          <h2 className="py-8 text-center text-4xl">Scan Check-In</h2>{" "}
          <QRComponent mode="check-in" />
        </div>
      ) : (
        <div className="py-12">
          <h2 className="py-8 text-center text-4xl">Manual Check-In</h2>
          <input
            type="text"
            placeholder="Cari nama"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[400px] rounded-md border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none sm:w-[600px]"
          />
          {searchResult.length === 0 ? (
            <div className="mt-4">
              <p className="text-lg text-gray-600">
                Tidak ada hasil pencarian.
              </p>
            </div>
          ) : (
            <div className="mt-4 w-[400px] space-y-4 sm:w-[600px]">
              {searchResult.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex w-full justify-between rounded-lg border border-gray-300 bg-white p-4 shadow"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">
                      {attendee.name}
                    </h2>
                    <p className="text-md text-gray-600 sm:text-lg">
                      {attendee.phone_number}
                    </p>
                    <p className="text-md text-gray-600 sm:text-lg">
                      {attendee.location}
                    </p>
                  </div>
                  <div className="text-md flex flex-col items-center space-y-2 sm:text-lg">
                    <button
                      disabled={attendee.is_present}
                      className={
                        (attendee.is_present
                          ? "bg-gray-300 text-black"
                          : "bg-green-500 text-white") +
                        " ml-auto rounded-md px-4 py-2"
                      }
                      onClick={() => {
                        axios
                          .patch(`/api/attendee/${attendee.id}/check-in`)
                          .then((res) => {
                            handlePrint(attendee.id);
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
                                err.response?.data.message ||
                                  "Undangan tidak terdaftar",
                                {
                                  type: "error",
                                },
                              );
                            },
                          );
                      }}
                    >
                      {attendee.is_present ? "Telah Check-in" : "Check-in"}
                    </button>
                    <button
                      onClick={() => handlePrint(attendee.id)}
                      className="ml-auto rounded-md bg-blue-500 px-4 py-2 text-white"
                    >
                      Print struk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
