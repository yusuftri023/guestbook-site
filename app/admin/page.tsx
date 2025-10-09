"use client";
import DownloadCSVButton from "@/components/download-csv-button";
import InvitationButton from "@/components/invitation-button";
import Button from "@/components/shared/button/Button";
import QRComponent from "@/components/shared/qr-scanner/qr-component";
import { Attendee } from "@prisma/client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { utils, writeFile } from "xlsx";
import * as xlsx from "xlsx";

export default function Admin() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Attendee[]>([]);
  const fetchData = async () => {
    await axios
      .get(`/api/admin/attendees?search=${search}`)
      .then((res) => {
        setSearchResult(res.data.data);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        toast(err.response?.data.message || "Gagal mengambil data", {
          type: "error",
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, [search]);

  const handleDownloadCSV = async () => {
    type errorResponse = {
      code: string;
      error: string;
      message: string;
    };
    try {
      const res = await axios.get<
        any,
        AxiosResponse<Attendee[], errorResponse>
      >("/api/admin/attendees");
      const formattedData = res.data.map((attendee, i) => ({
        "No.": i + 1,
        Nama: attendee.name,
        "Nomor HP": attendee.phone_number,
        Lokasi: attendee.location,

        "Sudah Check-in": attendee.is_present ? "Ya" : "Belum",
        "Sudah Ambil Suvenir": attendee.is_gift_taken ? "Ya" : "Belum",
        "Waktu Check-in": attendee.present_at
          ? new Date(attendee.present_at).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            })
          : "-",
        "Waktu Ambil Suvenir": attendee.gift_taken_at
          ? new Date(attendee.gift_taken_at).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            })
          : "-",
      }));
      const ws = utils.json_to_sheet(formattedData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Sheet1");
      const xlsx = writeFile(wb, "Daftar_tamu.xlsx", { type: "base64" });
      const link = document.createElement("a");
      link.href = xlsx;
      link.download;
    } catch (error) {
      toast("Failed to download CSV", { type: "error" });
    }
  };

  const readUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e?.target?.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        axios
          .post("/api/admin/attendees", { data: json })
          .then(() => {
            toast("Berhasil mengimpor data", { type: "success" });
            fetchData();
          })
          .catch((err: AxiosError<{ message: string }>) => {
            toast(err.response?.data.message || "Gagal mengimpor data", {
              type: "error",
            });
          });
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-100">
      <div className="py-12">
        <h2 className="py-8 text-center text-4xl">Daftar Tamu</h2>
        <div className="mt-4 flex justify-between">
          <DownloadCSVButton url="/api/admin/attendees" />
          <button
            className="rounded-md bg-blue-700 px-6 py-2 font-medium text-white"
            onClick={handleDownloadCSV}
            type="button"
          >
            Download Daftar Tamu
          </button>
          <div>
            <input
              type="file"
              name="upload"
              id="upload"
              accept=".xlsx,.csv,.xls"
              onChange={readUploadFile}
              className="hidden"
            />
            <Button
              className="rounded-md bg-blue-700 px-6 py-2 font-medium text-white"
              onClick={() => {
                document?.getElementById("upload")?.click();
              }}
              type="button"
            >
              Unggah Daftar Tamu
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Cari nama"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[400px] rounded-md border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none sm:w-[600px]"
          />
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
                    {attendee.phone_number}
                  </p>
                  <p className="text-md text-gray-600 sm:text-lg">
                    {attendee.location}
                  </p>
                </div>
                <div className="text-md flex flex-col items-center justify-center space-y-2 sm:text-lg">
                  <InvitationButton
                    nomorHP={String(attendee.phone_number)}
                    attendee={attendee.name}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
