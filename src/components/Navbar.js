import Link from "next/link";
import { MapPinned } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#242424] px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10">
            <MapPinned size={18} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">vidamobile</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white">
            Sign in
          </Link>
          <Link href="/register" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#242424] transition hover:bg-zinc-100">
            Create account
          </Link>
        </div>
      </div>
    </nav>
  );
}
