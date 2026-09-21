import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-[calc(100vh-84px)] overflow-hidden px-4 pb-20 pt-16">
        <div className="pointer-events-none absolute left-[8%] top-24 h-56 w-56 rounded-full bg-indigo-200/35 blur-3xl animate-float" />
        <div className="pointer-events-none absolute right-[7%] top-40 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl animate-float" />

        <section className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center animate-enter">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/75 px-4 py-2 text-sm font-semibold text-[#5b5ce2] shadow-sm">
              <MapPin size={15} />
              Your city, all in one place
            </span>

            <h1 className="mt-7 text-5xl font-black tracking-[-0.05em] text-gray-950 sm:text-6xl md:text-7xl">
              Find the plans
              <span className="block bg-gradient-to-r from-[#5b5ce2] to-sky-500 bg-clip-text text-transparent">
                worth showing up for.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500 sm:text-xl">
              Discover nearby events, see what friends are doing, and turn a map full of places into a calendar full of plans.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-6 py-3.5 font-semibold text-white shadow-xl shadow-gray-200 transition hover:-translate-y-1 hover:bg-[#5b5ce2]"
              >
                Start exploring
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-3.5 font-semibold text-gray-700 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              { icon: CalendarDays, title: "Discover events", text: "Browse public events and keep your next plan close." },
              { icon: MapPin, title: "Explore visually", text: "See what's happening around you directly on the map." },
              { icon: Users, title: "Bring your people", text: "Add friends, share invites, and make plans together." },
            ].map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="card-lift glass rounded-3xl p-6 shadow-[0_14px_45px_rgba(17,24,39,0.05)] animate-enter"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-[#5b5ce2]">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-bold text-gray-950">{title}</h2>
                <p className="mt-2 leading-6 text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
