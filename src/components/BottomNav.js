"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MapPin, UserCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;

  const tabs = [
    { name: "Events", href: "/events", icon: CalendarDays },
    { name: "Map", href: "/map", icon: MapPin },
    { name: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <nav className="glass mx-auto flex max-w-md items-center justify-around rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex min-w-24 flex-col items-center gap-1 rounded-xl px-5 py-2 transition-all duration-200 ${
                active
                  ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-950/40"
                  : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-200"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[11px] font-semibold">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
