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
      <body className={`${spaceGrotesk.variable} ${firaCode.variable} antialiased`}>
        <div className="md:hidden">
          <main className="mx-auto max-w-[480px] px-4 pb-28 pt-6 text-[--foreground]">
            <Link href="/" className="sr-only">
              Zero to Hero Home
            </Link>
            {children}
          </main>
          <NavBar />
        </div>
        <div className="hidden min-h-screen items-center justify-center bg-white px-8 text-center text-lg font-semibold text-[--foreground] md:flex">
          This app is designed for mobile. Resize to a smaller width to view it.
        </div>
      </body>
    </html>
  );
}
