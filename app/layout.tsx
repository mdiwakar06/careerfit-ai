import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerFit AI — Privacy-First Bidirectional Career Co-Pilot",
  description:
    "Match software engineers to job descriptions and company cultures with client-side PII scrubbing, dual 0-10 match scoring, Google X-Y-Z resume rewrites, and grounded AI interview intelligence.",
  keywords: [
    "AI career co-pilot",
    "software engineer resume review",
    "job description match",
    "Google X-Y-Z formula",
    "privacy-first ATS",
    "pgvector career match",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f7f8f6] text-[#17211d]">
        {children}
      </body>
    </html>
  );
}
