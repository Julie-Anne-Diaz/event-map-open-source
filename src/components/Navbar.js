import Link from "next/link";
import { MapPinned } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3 shadow-[0_10px_35px_rgba(17,24,39,0.06)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5b5ce2] text-white shadow-lg shadow-indigo-200 transition-transform group-hover:rotate-6">
            <MapPinned size={19} />
          </span>
          <span className="text-xl font-black tracking-tight text-gray-950">Loop</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-gray-950"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-[#5b5ce2]"
          >
            Create account
          </Link>
        </div>
      </div>
    </nav>
  );
}
