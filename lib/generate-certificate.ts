import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQR } from "./generate-qr";
export async function generateCertificate({
  baseDomain,
  name,
  courseName,
  certificateId,
}: {
  baseDomain: string;
  name: string;
  courseName: string;
  certificateId: string;
}) {
  // Load a pre-generated PDF document
  const pdf = await fetch("/certificate-template-1.pdf").then((res) =>
    res.arrayBuffer(),
  );
  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(pdf);
  // Generate a QR code
  const qr = await generateQR(
    `${baseDomain}/verify-certificate?credential-id=ID-${certificateId}`,
  );

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const courierObliqueFont = await pdfDoc.embedFont(
    StandardFonts.CourierBoldOblique,
  );
  const qrImage = await pdfDoc.embedPng(qr);
  const { width: qrWidth, height: qrHeight } = qrImage;
  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  // Get the generated text half width for positioning
  const textHalfWidth = name.length * 20;

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Draw a centered Name
  firstPage.drawText(name, {
    x: width / 2 - textHalfWidth,
    y: height / 2,
    size: 84,
    font: helveticaFont,
    color: rgb(0.15, 0.15, 0.15),
  });
  const add = "telah menyelesaikan";
  const addHalfWidth = Math.floor(add.length * 14.5);
  firstPage.drawText(add, {
    x: width / 2 - addHalfWidth,
    y: height / 2 - 110,
    size: 48,
    font: courierObliqueFont,
    color: rgb(0.15, 0.15, 0.15),
  });
  const position = 175;
  if (courseName.length <= 30) {
    let courseNameHalfWidth = 14 * courseName.length;
    courseNameHalfWidth = Math.floor(courseNameHalfWidth);

    // Draw a centered Course Name
    firstPage.drawText(courseName, {
      x: width / 2 - courseNameHalfWidth,
      y: height / 2 - position,
      size: 48,
      font: courierFont,
      color: rgb(0.15, 0.15, 0.15),
    });
  } else {
    const half = courseName.slice(0, Math.floor(courseName.length / 2));
    const lastSpaceIndex = half.lastIndexOf(" ");
    const arrayStr = [
      courseName.slice(0, lastSpaceIndex),
      courseName.slice(lastSpaceIndex),
    ];

    arrayStr.forEach((string, i) => {
      const courseNameHalfWidth = string.length * 14;
      firstPage.drawText(string, {
        x: width / 2 - courseNameHalfWidth,
        y: height / 2 - i * 60 - position,
        size: 48,
        font: courierFont,
        color: rgb(0.15, 0.15, 0.15),
      });
    });
    // Draw a centered Course Name
  }

  // Draw a QR code
  firstPage.drawImage(qrImage, {
    x: width / 2 - qrWidth / 2,
    y: height / 2 - 500,
    width: qrWidth,
    height: qrHeight,
  });

  // Serialize the PDFDocument to Base64
  return pdfDoc.saveAsBase64({ dataUri: true });
}
