import Link from "next/link";

export default function MapPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Map coming soon</p>
      {/*add new event button*/}
      <Link 
        href="/create-event" 
        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
        + Add Event
      </Link>
    </main>

    
  );
}