"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getUserEvents, getFriends } from "@/lib/api";

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
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 px-4 pb-20">
      <div className="w-full max-w-3xl mx-auto py-12">

        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">

            {/* Left - avatar and name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                {formatUsername(user?.email)?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {formatUsername(user?.email)}
                </h1>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Right - stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{friends.length}</p>
                <p className="text-xs text-gray-500">Friends</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{events.length}</p>
                <p className="text-xs text-gray-500">Events</p>
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Your Events */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Events</h2>

        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">You haven't created any events yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{event.location_name}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatEventTime(event.start_time, event.end_time)}
                    </p>
                    {event.description && (
                      <p className="text-gray-600 text-sm mt-2">{event.description}</p>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0">
                    {event.visibility}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </main>
  );
}