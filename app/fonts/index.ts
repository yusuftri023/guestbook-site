import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const sfPro = localFont({
  src: "./SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
  display: "swap",
});
export const poppins = localFont({
  src: "./Poppins-Regular.ttf",
  variable: "--font-poppins",
  display: "swap",
});
export const chetta = localFont({
  src: "./ChettaVissto.otf",
  variable: "--font-chetta",
  display: "swap",
});
export const fortalesia = localFont({
  src: "./FortalesiaPlain.otf",
  variable: "--font-fortalesia",
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
