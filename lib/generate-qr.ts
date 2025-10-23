import qr from "qrcode";
export async function generateQR(str: string) {
  return await qr.toDataURL(str, {
    errorCorrectionLevel: "H",
    width: 60,
  });
}
