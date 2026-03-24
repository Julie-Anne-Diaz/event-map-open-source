import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Loop
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/login"
            className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
