import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  metadataBase: new URL("https://careerfit-ai-studio.vercel.app"),
  title: "CareerFit AI Studio — Privacy-First Bidirectional Career Co-Pilot",
  description:
    "Match software engineers to job descriptions and company cultures with client-side PII scrubbing, dual 0-10 match scoring, Google X-Y-Z resume rewrites, and grounded AI interview intelligence.",
  keywords: [
    "AI career co-pilot",
    "software engineer resume review",
    "job description match",
    "Google X-Y-Z formula",
    "privacy-first ATS",
    "pgvector career match",
    "CareerFit AI Studio",
  ],
  authors: [{ name: "CareerFit AI Studio" }],
  openGraph: {
    title: "CareerFit AI Studio — Privacy-First Bidirectional Career Co-Pilot",
    description:
      "Dual 0-10 Role & Culture Match Scoring • Google X-Y-Z Resume Rewriter • Grounded pgvector Q&A Workspace with 100% PII Sanitization.",
    url: "https://careerfit-ai-studio.vercel.app",
    siteName: "CareerFit AI Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerFit AI Studio — Privacy-First Career Co-Pilot",
    description:
      "Match software engineers to job descriptions & company cultures with Google X-Y-Z resume rewrites and multi-agent evaluation.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
        <SpeedInsights />
      </body>
    </html>
  );
}
