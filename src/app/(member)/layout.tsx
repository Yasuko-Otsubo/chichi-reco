import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "../_components/Nav";
import React from "react";
import { Footer } from "../_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} bg-bgColor text-gray-900 antialiased`}
    >
      {/* 共通ページ専用の構成 */}
      <div className="w-[80%] mx-auto">{children}</div>
      <div className="flex justify-center pb-6">
        <Nav />
      </div>
    </div>
  );
}
