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
        const [userData, eventsData, friendsData] = await Promise.all([getUser(userId), getUserEvents(userId), getFriends(userId)]);
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

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] text-zinc-500">Loading profile...</main>;
  if (error) return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] text-red-700">{error}</main>;

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 pb-32 pt-9">
      <div className="mx-auto w-full max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="h-24 bg-[linear-gradient(115deg,#b8a7ea,#7251d5,#38237d)]" />
          <div className="-mt-9 flex flex-col gap-6 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-[#242424] text-3xl font-black text-white">
                {formatUsername(user?.email)?.[0]?.toUpperCase()}
              </div>
              <div className="pb-1">
                <p className="text-xs font-bold text-violet-700">vidamobile profile</p>
                <h1 className="text-2xl font-extrabold text-zinc-900">{formatUsername(user?.email)}</h1>
                <p className="text-sm text-zinc-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl bg-zinc-100 px-5 py-3 text-center"><Users size={17} className="mx-auto mb-1 text-violet-700" /><p className="text-xl font-black text-zinc-900">{friends.length}</p><p className="text-xs text-zinc-500">Friends</p></div>
              <div className="rounded-xl bg-zinc-100 px-5 py-3 text-center"><CalendarDays size={17} className="mx-auto mb-1 text-violet-700" /><p className="text-xl font-black text-zinc-900">{events.length}</p><p className="text-xs text-zinc-500">Events</p></div>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-6 py-4">
            <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-red-600"><LogOut size={15} />Log out</button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-extrabold text-zinc-900">Your events</h2>
          <p className="mt-1 text-sm text-zinc-500">Everything you've put on the map.</p>

          {events.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">You haven't created any events yet.</div>
          ) : (
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <li key={event.id} className="card-lift rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-base font-bold text-zinc-900">{event.title}</h3><p className="mt-1 text-sm text-zinc-500">{event.location_name}</p></div>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold capitalize text-zinc-600">{event.visibility.replace("_", " ")}</span>
                  </div>
                  <p className="mt-4 text-xs font-medium text-zinc-400">{formatEventTime(event.start_time, event.end_time)}</p>
                  {event.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">{event.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
