"use client";

import { generateStruk } from "./generate-struk";

export default async function printPDF(text) {
  const pdf = await generateStruk({ id: text });
  printJS({
    printable: pdf.substring(28),
    type: "pdf",
    base64: true,
  });
}
