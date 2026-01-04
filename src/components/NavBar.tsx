'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/goals", label: "Goals & Memories" },
  { href: "/journal", label: "Journal" },
  { href: "/gym", label: "Gym" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-orange-400 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Zero to Hero
            </p>
            <p className="text-xs text-[--muted]">Supabase · Vercel ready</p>
          </div>
        </div>
        <nav className="flex flex-1 items-center justify-end gap-1 text-sm font-semibold sm:gap-2">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "text-[--muted] hover:bg-white hover:text-[--foreground]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
