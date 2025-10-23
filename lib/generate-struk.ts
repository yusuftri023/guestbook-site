import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQR } from "./generate-qr";
export async function generateStruk({ id }: { id: string }) {
  // Load a pre-generated PDF document
  const pdf = await fetch("/template-struk.pdf").then((res) =>
    res.arrayBuffer(),
  );
  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(pdf);
  // Generate a QR code
  const qr = await generateQR(id);

  const qrImage = await pdfDoc.embedPng(qr);
  const { width: qrWidth, height: qrHeight } = qrImage;
  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Draw a QR code
  firstPage.drawImage(qrImage, {
    x: width / 2 - qrWidth / 2,
    y: height / 2 - qrHeight / 2 + 18,
    width: qrWidth,
    height: qrHeight,
  });

  // Serialize the PDFDocument to Base64
  return pdfDoc.saveAsBase64({ dataUri: true });
}
