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

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
