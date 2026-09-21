"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEvents, deleteEvent } from "@/lib/api";
import {
  CalendarDays,
  Clock3,
  MapPin,
  MoreVertical,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setEventError("Failed to load events");
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, [router]);

  async function handleDelete(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(eventId);
    setOpenMenuId(null);
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (err) {
      alert("Failed to delete event");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  const formatDate = (value) =>
    new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  const formatTime = (value) =>
    new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <main className="min-h-screen px-4 pb-32 pt-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between animate-enter">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-300">
              <Sparkles size={16} />
              Discover what's happening
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Your event feed</h1>
            <p className="mt-2 text-slate-400">Find something interesting, then go make a memory.</p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-violet-300"
          >
            <Plus size={18} />
            Create event
          </Link>
        </div>

        <div className="mb-7 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur">
          <span className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white">Events</span>
          <Link href="/friends" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white">
            Friends
          </Link>
          <Link href="/invites" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white">
            Invites
          </Link>
        </div>

        {loadingEvents && (
          <div className="grid gap-5 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="dark-panel rounded-3xl p-6 shadow-sm">
                <div className="skeleton h-5 w-24 rounded-full" />
                <div className="skeleton mt-5 h-7 w-2/3 rounded-lg" />
                <div className="skeleton mt-3 h-4 w-full rounded-lg" />
                <div className="skeleton mt-2 h-4 w-4/5 rounded-lg" />
                <div className="skeleton mt-6 h-16 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {eventError && (
          <div className="rounded-2xl border border-red-400/15 bg-red-400/10 p-4 text-sm font-medium text-red-300">
            {eventError}
          </div>
        )}

        {!loadingEvents && !eventError && events.length === 0 && (
          <div className="glass rounded-3xl p-10 text-center shadow-sm animate-enter">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/10 text-violet-300">
              <CalendarDays />
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">Nothing on the calendar yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-slate-400">Create the first event and give everyone something to look forward to.</p>
          </div>
        )}

        {!loadingEvents && !eventError && events.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="card-lift dark-panel relative overflow-visible rounded-3xl p-6 shadow-[0_16px_50px_rgba(0,0,0,0.22)] animate-enter"
                style={{ animationDelay: `${Math.min(index * 55, 330)}ms` }}
              >
                <div className="absolute right-5 top-5">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                    className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                    aria-label="Event actions"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === event.id && (
                    <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-white/10 bg-[#11151e] p-1 shadow-2xl">
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deletingId === event.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-5 flex items-start gap-4 pr-10">
                  <div className="rounded-2xl border border-violet-400/15 bg-violet-400/10 px-3 py-2 text-center text-violet-300">
                    <div className="text-xs font-black uppercase">{new Date(event.start_time).toLocaleDateString([], { month: "short" })}</div>
                    <div className="text-2xl font-black leading-none">{new Date(event.start_time).getDate()}</div>
                  </div>
                  <div>
                    <span className="inline-flex rounded-full border border-violet-400/15 bg-violet-400/10 px-2.5 py-1 text-xs font-bold capitalize text-violet-300">
                      {event.visibility.replace("_", " ")}
                    </span>
                    <h2 className="mt-2 text-xl font-bold leading-tight text-white">{event.title}</h2>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-400">
                  {event.description || "No description provided."}
                </p>

                <div className="mt-5 grid gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-violet-300" />
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 size={16} className="text-violet-300" />
                    <span>{formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-violet-300" />
                    <span className="truncate">{event.location_name}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-violet-300" />
                      <span>Up to {event.capacity} people</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
