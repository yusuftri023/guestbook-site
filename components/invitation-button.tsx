"use client";

import Link from "next/link";

export default function InvitationButton({
  nomorHP,
  attendee,
}: {
  nomorHP: string;
  attendee: string;
}) {
  const message = `
    Assalamu’alaikum Warahmatullahi Wabarakatuh

    Dengan penuh rasa syukur kepada Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i ${attendee} sekeluarga untuk hadir dan memberikan doa restu pada acara pernikahan putra-putri kami:

    John Smith
    &
    Jane Doe

    Yang Insya Allah akan dilaksanakan pada:

    Hari/Tanggal: Minggu, 12 Oktober 2025
    Waktu: 10.00 WIB – selesai
    Tempat: Gedung Graha Cinta Abadi, Jakarta

    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu bagi kedua mempelai.

    Untuk informasi lengkap dan undangan digital, silakan kunjungi:
    https://wedding.pedagang-ecommerce.site/invitation?nomorhp=${nomorHP}

    Wassalamu’alaikum Warahmatullahi Wabarakatuh
    Hormat kami,
    Keluarga Besar John Smith & Jane Doe`;

  return (
    <Link
      className="block"
      target="_blank"
      href={`https://wa.me/${nomorHP}?text=${encodeURIComponent(message)}`}
    >
      <button className="flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
        Kirim Undangan
      </button>
    </Link>
  );
}
