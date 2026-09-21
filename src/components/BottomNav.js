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
      <nav className="mx-auto flex max-w-md items-center justify-around rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_14px_40px_rgba(24,24,27,0.14)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-24 flex-col items-center gap-1 rounded-xl px-5 py-2 transition ${
                active ? "bg-[#242424] text-white" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[11px] font-semibold">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
