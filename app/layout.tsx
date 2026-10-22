import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer";
import PriceTicker from "@/components/priceTicker";
const hindSiliguri=Hind_Siliguri({
  subsets:["bengali","latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "বাংলাদেশের বাজারদর এক নজরে দেখুন।",
};

export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return (
    <html
      lang="bn" data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<div className="h-16" />}>
            <Navbar />
        </Suspense>

        <PriceTicker />
          {children}
        <Footer />
      </body>
    </html>
  );
}
