import Footer from "@/components/layout/footer";

import ClientProviders from "../components/layout/ClientProviders";
import { inter, poppins } from "./fonts";
import "./globals.css";
import Script from "next/script";

// export const metadata: Metadata = {
//   title: "Jobs By Apoteker+",
//   description:
//     "Temukan Karir Impian Anda di Dunia Farmasi dengan Apoteker+ Job Portal.",
//   icons: [{ rel: "icon", url: "/icon.ico" }],
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: { index: true, follow: true },
//   },
//   openGraph: {
//     title:
//       "Temukan Karir Impian Anda di Dunia Farmasi dengan Apoteker+ Job Portal.",
//     url: "https://jobs.apotekerplus.com",
//     siteName: "Apoteker+",
//     description: `Temukan Karir Impian Anda di Dunia Farmasi dengan Apoteker+ Job Portal. Jelajahi ratusan peluang kerja untuk calon apoteker di seluruh Indonesia.`,
//     type: "website",
//     images: [
//       {
//         url: "https://jobs.apotekerplus.com/og_image.jpg",
//         width: 1200,
//         height: 630,
//       },
//     ],
//   },
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <head>
        <meta
          name="google-site-verification"
          content="iQeiaCLbHW8wNZGvfb1xjl2BQtp5k3NL7oa_do6jykQ"
        />
      </head> */}

      <body
        className={` ${poppins.className} ${inter.variable} h-screen w-full bg-white`}
      >
        <Script
          src="https://printjs-4de6.kxcdn.com/print.min.js"
          strategy="beforeInteractive"
        />

        <ClientProviders>
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
