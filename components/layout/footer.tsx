"use client";
import appstoreLogo from "@/public/appstore.svg";
import googlePlayLogo from "@/public/google-play.svg";
import whiteLogo from "@/public/logo-white.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  const page = ["/watch/", "/register", "/login", "/forgot-password"];

  return (
    !page.some((item) => pathname.search(item) !== -1) && (
      <footer className="font-poppins w-full bg-primary text-sm text-white">
        <div className="mx-auto flex justify-center overflow-hidden">
          <div className="my-10 grid w-[90%] grid-cols-1 gap-x-10 gap-y-8 md:w-[1000px] lg:w-[1200px]">
            <div className="w-full space-y-4 md:w-1/2">
              <Image
                src={whiteLogo}
                width={200}
                height={40}
                alt="logo apoteker+"
              />
              <p className="md:line-clamp-4">
                Join us at Apoteker Plus, where learning pharmacy is made
                simple, engaging, and accessible—anytime, anywhere!
              </p>
              <div className="block place-items-center space-y-4 md:flex md:space-x-4 md:space-y-0">
                <Image
                  src={googlePlayLogo}
                  width={160}
                  height={40}
                  alt="logo apoteker+"
                />
                <Image
                  src={appstoreLogo}
                  width={160}
                  height={40}
                  alt="logo apoteker+"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  );
}
