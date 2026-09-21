"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getUserEvents, getFriends } from "@/lib/api";
import { CalendarDays, LogOut, Users } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const [userData, eventsData, friendsData] = await Promise.all([
          getUser(userId),
          getUserEvents(userId),
          getFriends(userId),
        ]);
        setUser(userData);
        setEvents(eventsData);
        setFriends(friendsData);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUserId");
    router.push("/login");
  }

  function formatUsername(email) {
    return email?.split("@")[0] ?? "user";
  }

  function formatEventTime(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} · ${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center text-slate-500">Loading profile...</main>;
  }

  if (error) {
    return <main className="flex min-h-screen items-center justify-center text-red-300">{error}</main>;
  }

  return (
    <main className="min-h-screen px-4 pb-32 pt-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="dark-panel relative overflow-hidden rounded-[2rem] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] animate-enter sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 text-3xl font-black text-white shadow-xl shadow-violet-950/30">
                {formatUsername(user?.email)?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">Your profile</p>
                <h1 className="mt-1 text-3xl font-black text-white">{formatUsername(user?.email)}</h1>
                <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 text-center">
                <Users size={17} className="mx-auto mb-1 text-cyan-300" />
                <p className="text-xl font-black text-white">{friends.length}</p>
                <p className="text-xs text-slate-500">Friends</p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 text-center">
                <CalendarDays size={17} className="mx-auto mb-1 text-violet-300" />
                <p className="text-xl font-black text-white">{events.length}</p>
                <p className="text-xs text-slate-500">Events</p>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-red-300">
            <LogOut size={15} />
            Log out
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-black text-white">Your events</h2>
          <p className="mt-1 text-sm text-slate-500">Everything you've put on the map.</p>

          {events.length === 0 ? (
            <div className="glass mt-5 rounded-3xl p-8 text-center text-sm text-slate-500">You haven't created any events yet.</div>
          ) : (
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <li key={event.id} className="card-lift dark-panel rounded-3xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{event.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{event.location_name}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-violet-400/15 bg-violet-400/10 px-2.5 py-1 text-xs font-bold capitalize text-violet-300">
                      {event.visibility.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-500">{formatEventTime(event.start_time, event.end_time)}</p>
                  {event.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{event.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
