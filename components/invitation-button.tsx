"use client";

import Link from "next/link";

export default function InvitationButton({
  nomorHP,
  attendee,
  showText = true,
}: {
  nomorHP: string;
  attendee: string;
  showText?: boolean;
}) {
  const message = `
    Assalamu’alaikum Warahmatullahi Wabarakatuh
    Yth. Bapak/Ibu/Saudara/i,
    ${attendee}

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
    https://invitation.evolvion.biz.id/${showText ? "digital-wedding-invitation" : "digital-wedding-invitation2"}?nomorhp=${nomorHP}

    Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

    Terima kasih

    Kami yang berbahagia,
    Keluarga Bapak drh. H. Agus Dwiharjoto & Ibu drh. Hj. Siti Hanifah
    Keluarga Bapak H. Ade Herlambang & Ibu Hj. Eka Rini Yulianti, A.Md.
    Fio & Anggi`;

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
