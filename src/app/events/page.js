"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEvents } from "@/lib/api";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 px-4">
      <div className="w-full max-w-3xl mx-auto py-12">
        <div className="flex justify-between mb-6">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button className="px-3 py-1 rounded-lg text-xs font-medium bg-black text-white shadow-sm">
              Events
            </button>
            <Link
              href="/friends"
              className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
            >
              Friends
            </Link>
            <Link
              href="/invites"
              className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
            >
              Invites
            </Link>
          </div>

          <Link
            href="/create-event"
            className="px-3 py-1 rounded-lg text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Create Event
          </Link>
        </div>

        <section>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Events</h1>

          {loadingEvents && <p className="text-gray-600">Loading events...</p>}
          {eventError && <p className="text-red-600">{eventError}</p>}

          {!loadingEvents && !eventError && events.length === 0 && (
            <p className="text-gray-600">No events found yet.</p>
          )}

          {!loadingEvents && !eventError && events.length > 0 && (
            <div className="overflow-y-auto max-h-[60vh] pr-2 grid gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                >
                  
                  <h2 className="text-xl font-semibold text-gray-800">
                    {event.title}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {event.description || "No description provided."}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Visibility:</span>{" "}
                      {event.visibility}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {event.location_name}
                    </p>
                    <p>
                      <span className="font-semibold">Starts:</span>{" "}
                      {new Date(event.start_time).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">Ends:</span>{" "}
                      {new Date(event.end_time).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {event.location_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}