import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 pb-20 pt-12 text-zinc-900">
        <section className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(115deg,#b8a7ea_0%,#7251d5_48%,#38237d_100%)] px-6 py-16 text-center text-white sm:px-10 sm:py-20 lg:py-24 animate-enter">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.17em] text-white/80">vidamobile</p>
              <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Your city has plans.
                <span className="block">Go find yours.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                Discover nearby events, see what your friends are doing, and keep the best things happening around you in one place.
              </p>

              <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-[0_12px_32px_rgba(35,18,84,0.18)] sm:flex-row">
                <div className="flex flex-1 items-center gap-3 px-4 py-3 text-left text-zinc-500">
                  <MapPin size={19} className="text-zinc-400" />
                  <span className="text-sm sm:text-base">Events, friends, and places near you</span>
                </div>
                <Link href="/register" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#242424] px-5 py-3 font-bold text-white transition hover:bg-black">
                  Explore vidamobile
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-6xl">
            <div className="mb-7 max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">Everything happening, minus the clutter.</h2>
              <p className="mt-3 leading-7 text-zinc-500">A simple way to find a plan, invite someone, or see what's close.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                { icon: CalendarDays, title: "Find something to do", text: "Browse events without digging through a dozen different apps." },
                { icon: MapPin, title: "See it on the map", text: "Jump from a list of plans to the places they're actually happening." },
                { icon: Users, title: "Bring your friends", text: "Keep invites and your social plans connected to the event itself." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="card-lift rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
                    <Icon size={21} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                  <p className="mt-2 leading-6 text-zinc-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
