"use client";
import GuestCount from "@/components/guest-count";
import QRComponent from "@/components/shared/qr-scanner/qr-component";
import printPDF from "@/lib/print-pdf";
import { Attendee } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AttendeesCount() {
  const [searchResult, setSearchResult] = useState<Attendee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "present" | "not-present">(
    "all",
  );
  const [count, setCount] = useState<{
    total: number;
    present: number;
  }>({
    total: 0,
    present: 0,
  });
  useEffect(() => {
    const timerId = setInterval(() => {
      console.log(filter);
      axios
        .get(
          `/api/admin/attendees${search ? `?search=${search}` : ""}${filter == "all" ? "" : `${filter === "present" ? `${search ? "&" : "?"}filter=present` : `${search ? "&" : "?"}filter=not-present`}`}`,
        ) // Example API endpoint
        .then((res) => {
          setSearchResult(res.data.data);
          setCount(res.data.count);
        })
        .catch((err) => {
          console.error("Error fetching attendees:", err);
        });
    }, 2000);
    return () => {
      clearInterval(timerId);
    };
  }, [search, filter]);
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-100">
      <div className="py-12">
        <h2 className="py-8 text-center text-4xl">Penghitungan Pengunjung</h2>

        <GuestCount count={count} />
        <div className="flex w-[400px] space-x-2 text-lg sm:w-[600px]">
          <input
            type="text"
            placeholder="Cari nama"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={filter}
            onChange={(e) => {
              console.log(e.target.value);
              setFilter(e.target.value as "all" | "present" | "not-present");
            }}
            className="rounded-md border-gray-300 px-4 py-2 transition-all duration-200 ease-in-out invalid:text-black/50 focus:text-black"
          >
            <option className="disabled:text-white" value={"all"}>
              Semua
            </option>
            <option key={"hadir"} value={"present"}>
              Hadir
            </option>
            <option key={"belum-hadir"} value={"not-present"}>
              Belum Hadir
            </option>
          </select>
        </div>
        {searchResult.length === 0 ? (
          <div className="mt-4">
            <p className="text-lg text-gray-600">Tidak ada hasil pencarian.</p>
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
                    {attendee.location}
                  </p>
                </div>
                <div className="text-md flex flex-col items-end space-y-2 sm:text-lg">
                  <h2
                    className={
                      (attendee.is_present && attendee.present_at
                        ? "text-green-500"
                        : "text-red-500") + ` text-xl font-semibold sm:text-2xl`
                    }
                  >
                    {attendee.is_present ? "Hadir" : "Belum Hadir"}
                  </h2>
                  <p className="text-md text-gray-600 sm:text-lg">
                    {attendee.present_at
                      ? `${new Date(attendee.present_at).toLocaleString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}`
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
