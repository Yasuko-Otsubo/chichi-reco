import { Geist, Geist_Mono } from "next/font/google";
import { Navi } from "../_components/Navi";
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
      className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-900 antialiased`}
    >
      {/* 共通ページ専用の構成 */}
      {children}
      <Navi />
      <Footer />
    </div>
  );
}
