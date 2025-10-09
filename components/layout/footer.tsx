"use client";
import appstoreLogo from "@/public/appstore.svg";
import googlePlayLogo from "@/public/google-play.svg";
import whiteLogo from "@/public/logo-white.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  const page = ["/watch/", "/register", "/login", "/forgot-password"];

  return <></>;
}
