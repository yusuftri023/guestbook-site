"use client";
import DownloadCSVButton from "@/components/download-csv-button";
import InvitationButton from "@/components/invitation-button";
import Button from "@/components/shared/button/Button";
import Modal from "@/components/shared/modal";
import QRComponent from "@/components/shared/qr-scanner/qr-component";
import { Attendee } from "@prisma/client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { utils, writeFile } from "xlsx";
import * as xlsx from "xlsx";
import { set } from "zod";

export default function Admin() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Attendee[]>([]);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null,
  );
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
    <>
      <Modal
        showModal={isShowModal}
        setShowModal={setIsShowModal}
        withCloseButton
      >
        <div className="px-6 py-10">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (modalMode === "add") {
                axios
                  .post("/api/admin/attendee", {
                    name: e.currentTarget.Nama.value,
                    location: e.currentTarget.Lokasi.value,
                    phone_number: e.currentTarget.NomorHP.value,
                    is_amplop: e.currentTarget.TerimaAmplop.checked,
                  })
                  .then(() => {
                    toast("Berhasil menambahkan data", { type: "success" });
                  })
                  .catch(() => {
                    toast("Gagal menambahkan data", { type: "error" });
                  })
                  .finally(() => {
                    fetchData();
                  });
              } else if (modalMode === "edit" && selectedAttendee) {
                axios
                  .put(`/api/admin/attendee/${selectedAttendee.id}`, {
                    name: e.currentTarget.Nama.value,
                    location: e.currentTarget.Lokasi.value,
                    phone_number: e.currentTarget.NomorHP.value,
                    is_amplop: e.currentTarget.TerimaAmplop.checked,
                  })
                  .then(() => {
                    toast("Berhasil mengedit data", { type: "success" });
                  })
                  .catch(() => {
                    toast("Gagal mengedit data", { type: "error" });
                  })
                  .finally(() => {
                    fetchData();
                  });
              }
              setIsShowModal(false);
              setSelectedAttendee(null);
            }}
          >
            <h2 className="text-xl font-medium">Nama</h2>
            <div
              className={`flex rounded-md border-2 bg-white focus-within:border-gray-500`}
            >
              <label htmlFor="Nama" className="w-full">
                <input
                  required
                  id="Nama"
                  type="text"
                  className={`w-full border-0 border-transparent bg-transparent text-lg focus:ring-0`}
                  placeholder="Nama lengkap undangan"
                  defaultValue={selectedAttendee?.name || ""}
                />
              </label>
            </div>
            <h2 className="text-xl font-medium">Nomor HP</h2>
            <div
              className={`flex rounded-md border-2 bg-white focus-within:border-gray-500`}
            >
              <label htmlFor="NomorHP" className="w-full">
                <input
                  required
                  id="NomorHP"
                  type="text"
                  className={`w-full border-0 border-transparent bg-transparent text-lg focus:ring-0`}
                  placeholder="Nomor HP (gunakan kode negara, contoh: 6281234567890)"
                  defaultValue={selectedAttendee?.phone_number || ""}
                />
              </label>
            </div>
            <h2 className="text-xl font-medium">Lokasi</h2>
            <div
              className={`flex rounded-md border-2 bg-white focus-within:border-gray-500`}
            >
              <label htmlFor="Lokasi" className="w-full">
                <input
                  required
                  id="Lokasi"
                  type="text"
                  className={`w-full border-0 border-transparent bg-transparent text-lg focus:ring-0`}
                  placeholder="Lokasi (contoh: Jakarta, Surabaya, dll)"
                  defaultValue={selectedAttendee?.location || ""}
                />
              </label>
            </div>
            <label htmlFor="TerimaAmplop" className="flex items-center gap-2">
              <input
                id="TerimaAmplop"
                type="checkbox"
                className="rounded-md"
                defaultChecked={selectedAttendee?.is_amplop ?? false}
              />
              <span className="text-lg">Menerima amplop</span>
            </label>
            <div className="flex w-full justify-end space-x-4 pt-4">
              <Button
                type="button"
                className="rounded-md bg-gray-300 px-6 py-2 font-medium text-gray-700"
                onClick={() => {
                  setIsShowModal(false);
                  setSelectedAttendee(null);
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-md bg-blue-700 px-6 py-2 font-medium text-white"
              >
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-100">
        <div className="py-12">
          <h2 className="py-8 text-center text-4xl">Daftar Tamu</h2>
          <div className="mt-4 flex justify-between">
            <DownloadCSVButton url="/api/admin/attendees" />

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
          <button
            onClick={() => {
              setIsShowModal(true);
              setModalMode("add");
              setSelectedAttendee(null);
            }}
            className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-center text-white"
          >
            Tambah Tamu
          </button>
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
                  <div className="text-md flex flex-col items-center justify-center space-y-2 sm:text-lg">
                    <InvitationButton
                      nomorHP={String(attendee.phone_number)}
                      attendee={attendee.name}
                    />
                    <button
                      onClick={() => {
                        const message = `
Assalamu’alaikum Warahmatullahi Wabarakatuh
Yth. Bapak/Ibu/Saudara/i,
${attendee.name}

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan turut memberikan doa restu secara langsung dalam acara Ngunduh Mantu:

apt. ARIFFIO DAVA PRIHANDOYO, S.Farm
Putra dari Bapak drh. H. Agus Dwiharjoto & Ibu drh. Hj. Siti Hanifah

dan

apt. ANGGHIA CALVINA IZUMI, S.Farm
Putri dari Bapak H. Ade Herlambang & Ibu Hj. Eka Rini Yulianti, A.Md.

Yang akan diselenggarakan pada:
� Sabtu, 25 Oktober 2025
� 19.00 - 22.00 WIB
� Agis Restaurant, Kota Surabaya

Mohon dapat mengakses undangan dan mengisi konfirmasi kehadiran pada link berikut:
https://invitation.evolvion.biz.id/${attendee.is_amplop ? "digital-wedding-invitation" : "digital-wedding-invitation2"}?nomorhp=${attendee.phone_number}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih

Kami yang berbahagia,
Keluarga Bapak drh. H. Agus Dwiharjoto & Ibu drh. Hj. Siti Hanifah
Keluarga Bapak H. Ade Herlambang & Ibu Hj. Eka Rini Yulianti, A.Md.
Fio & Anggi`;
                        navigator.clipboard.writeText(message);
                        toast("Pesan berhasil disalin", {
                          type: "success",
                          autoClose: 1000,
                        });
                      }}
                      className="w-full rounded-md bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700"
                    >
                      Salin Pesan
                    </button>
                    <button
                      onClick={() => {
                        setIsShowModal(true);
                        setModalMode("edit");
                        setSelectedAttendee(attendee);
                      }}
                      className="w-full rounded-md bg-green-600 px-4 py-2 text-center text-white"
                    >
                      Edit Tamu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
