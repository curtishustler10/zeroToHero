'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, List, NotebookPen } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/goals", label: "Goals", icon: List },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/gym", label: "Gym", icon: Dumbbell },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden">
      <div className="mx-auto flex max-w-[480px] items-center justify-between px-3 py-2">
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-1 justify-center"
            >
              <div
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs font-semibold transition ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.4]" : "stroke-2"}`} />
                <span>{link.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
