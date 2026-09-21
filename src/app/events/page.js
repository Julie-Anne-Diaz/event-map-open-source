"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEvents, deleteEvent } from "@/lib/api";
import { CalendarDays, Clock3, MapPin, MoreVertical, Plus, Trash2, Users } from "lucide-react";

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
        setEvents(await getEvents());
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

  const formatDate = (value) => new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  const formatTime = (value) => new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 pb-32 pt-9">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between animate-enter">
          <div>
            <p className="text-sm font-bold text-violet-700">vidamobile events</p>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-zinc-900">What's happening</h1>
            <p className="mt-2 text-zinc-500">Pick a plan. The hard part is deciding which one.</p>
          </div>

          <Link href="/create-event" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#242424] px-5 py-3 font-bold text-white transition hover:bg-black">
            <Plus size={18} />
            Create event
          </Link>
        </div>

        <div className="mb-7 inline-flex rounded-xl border border-zinc-200 bg-white p-1">
          <span className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Events</span>
          <Link href="/friends" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">Friends</Link>
          <Link href="/invites" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">Invites</Link>
        </div>

        {loadingEvents && (
          <div className="grid gap-5 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="skeleton h-5 w-24 rounded-full" />
                <div className="skeleton mt-5 h-7 w-2/3 rounded-lg" />
                <div className="skeleton mt-3 h-4 w-full rounded-lg" />
                <div className="skeleton mt-2 h-4 w-4/5 rounded-lg" />
                <div className="skeleton mt-6 h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {eventError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{eventError}</div>}

        {!loadingEvents && !eventError && events.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-violet-100 text-violet-700"><CalendarDays /></div>
            <h2 className="mt-5 text-xl font-bold text-zinc-900">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-zinc-500">Create the first event and give people somewhere to be.</p>
          </div>
        )}

        {!loadingEvents && !eventError && events.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {events.map((event, index) => (
              <article key={event.id} className="card-lift relative rounded-2xl border border-zinc-200 bg-white p-6 animate-enter" style={{ animationDelay: `${Math.min(index * 45, 260)}ms` }}>
                <div className="absolute right-5 top-5">
                  <button onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)} className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-800">
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === event.id && (
                    <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl">
                      <button onClick={() => handleDelete(event.id)} disabled={deletingId === event.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                        <Trash2 size={14} />
                        {deletingId === event.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-5 flex items-start gap-4 pr-10">
                  <div className="rounded-xl bg-violet-100 px-3 py-2 text-center text-violet-700">
                    <div className="text-[10px] font-black uppercase">{new Date(event.start_time).toLocaleDateString([], { month: "short" })}</div>
                    <div className="text-2xl font-black leading-none">{new Date(event.start_time).getDate()}</div>
                  </div>
                  <div>
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold capitalize text-zinc-600">{event.visibility.replace("_", " ")}</span>
                    <h2 className="mt-2 text-xl font-bold leading-tight text-zinc-900">{event.title}</h2>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-zinc-500">{event.description || "No description provided."}</p>

                <div className="mt-5 grid gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
                  <div className="flex items-center gap-3"><CalendarDays size={16} className="text-violet-700" /><span>{formatDate(event.start_time)}</span></div>
                  <div className="flex items-center gap-3"><Clock3 size={16} className="text-violet-700" /><span>{formatTime(event.start_time)} – {formatTime(event.end_time)}</span></div>
                  <div className="flex items-center gap-3"><MapPin size={16} className="text-violet-700" /><span className="truncate">{event.location_name}</span></div>
                  {event.capacity && <div className="flex items-center gap-3"><Users size={16} className="text-violet-700" /><span>Up to {event.capacity} people</span></div>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
