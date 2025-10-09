"use client";
import axios, { type AxiosResponse } from "axios";
import { utils, writeFile } from "xlsx";
import { toast } from "react-toastify";
import { Attendee } from "@prisma/client";
import { generateQR } from "@/lib/generate-qr";
import ExcelJS from "exceljs";

export default function DownloadCSVButton({
  url,
  filename,
}: {
  url: string;
  filename?: string;
}) {
  const handleDownloadCSV = async () => {
    type successResponse = {
      data: Attendee[];
      code: "SUCCESS";
    };
    type errorResponse = {
      code: string;
      error: string;
      message: string;
    };
    try {
      const res = await axios.get<
        any,
        AxiosResponse<successResponse, errorResponse>
      >(url);

      const data = res.data.data.map((attendees, i) => {
        return {
          No: i,
          ...attendees,
        };
      });
      const wb = new ExcelJS.Workbook();
      wb.creator = "yusuf";
      wb.created = new Date();
      const ws = wb.addWorksheet("Data dengan QR");
      for (let r = 2; r <= data.length + 1; r++) {
        const currentRow = ws.getRow(r);
        currentRow.height = 80;
        currentRow.getCell(5).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
      ws.columns = [
        { header: "No.", width: 10 },
        { header: "Nama", width: 20 },
        { header: "Nomor Telefon", width: 20 },
        { header: "Lokasi", width: 30 },
        { header: "Kode QR", width: 13 },
      ];

      const AllQr = data.map(async (_, i) => {
        const QR = await generateQR(data[i].id);
        return QR;
      });
      const doneData = await Promise.all(AllQr);
      doneData.forEach((qr, index) => {
        const imageId = wb.addImage({
          base64: qr,
          extension: "png",
        });

        ws.addImage(imageId, {
          tl: { col: 4, row: index + 1 },
          ext: { width: 100, height: 100 },
        });
      });

      data.forEach(async (attendee, index) => {
        const row = ws.getRow(index + 2);
        row.getCell(1).value = attendee.No + 1;
        row.getCell(2).value = attendee.name;
        row.getCell(3).value = attendee.phone_number;
        row.getCell(4).value = attendee.location;
        row.commit();
      });
      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const xlsx = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = xlsx;
      link.download = "daftar_tamu.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast("Failed to download CSV", { type: "error" });
    }
  };
  return (
    <button
      className="mt-4 rounded-md bg-blue-700 px-6 py-2 font-medium text-white"
      onClick={handleDownloadCSV}
      type="button"
    >
      Download Statistics
    </button>
  );
}
