import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-2xl">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Events Near You
          </h1>
          {/* Description */}
          <p className="text-2xl text-gray-500 mb-10">
            Find and explore local events happening around you all in one place.
          </p>
          {/* Get Started Button */}
          <Link href="/login" className="bg-black text-white py-6 px-12 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors">
            Get started
          </Link>
        </div>
      </main>
    </>
  );
}