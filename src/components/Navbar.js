import Link from "next/link";
import { MapPinned } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-950/40 transition-transform group-hover:rotate-6">
            <MapPinned size={19} />
          </span>
          <span className="text-xl font-black tracking-tight text-white">Loop</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-violet-400"
          >
            Create account
          </Link>
        </div>
      </div>
    </nav>
  );
}
