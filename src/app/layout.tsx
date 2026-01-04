import type { Metadata } from "next";
import { Space_Grotesk, Fira_Code } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavBar from "@/components/NavBar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-gt-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-gt-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zero to Hero — Life OS",
  description: "Personal tracker for money, habits, goals, journal, and gym, built with Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${firaCode.variable} antialiased`}
      >
        <div className="min-h-screen text-[--foreground]">
          <NavBar />
          <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-10">
            <Link href="/" className="sr-only">
              Zero to Hero Home
            </Link>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
