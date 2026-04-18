"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MapPin, UserCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;
  const tabs = [
    { name: "Events", href: "/events", icon: <CalendarDays /> },
    { name: "Map", href: "/map", icon: <MapPin /> },
    { name: "Profile", href: "/profile", icon: <UserCircle /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around max-w-3xl mx-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              pathname === tab.href
                ? "text-black font-medium"
                : "text-gray-400"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}