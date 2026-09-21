import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-[calc(100vh-84px)] overflow-hidden px-4 pb-20 pt-16">
        <div className="pointer-events-none absolute left-[7%] top-16 h-72 w-72 rounded-full bg-violet-600/20 blur-[90px] animate-float" />
        <div className="pointer-events-none absolute right-[8%] top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px] animate-float" />
        <div className="pointer-events-none absolute left-1/2 top-[28rem] h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center animate-enter">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-300">
              <MapPin size={15} />
              Your city, all in one place
            </span>

            <h1 className="mt-7 text-5xl font-black tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">
              Find the plans
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                worth showing up for.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Discover nearby events, see what friends are doing, and turn a map full of places into a calendar full of plans.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950 shadow-xl shadow-black/25 transition hover:-translate-y-1 hover:bg-violet-300"
              >
                Start exploring
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-semibold text-slate-300 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.07] hover:text-white"
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
                className="card-lift glass rounded-3xl p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] animate-enter"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/10 text-violet-300">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <p className="mt-2 leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
