"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEvents } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");

  useEffect(() => {
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
  }, []);

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
            <div className="grid gap-4">
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
                      <span className="font-semibold">Coordinates:</span>{" "}
                      {event.latitude}, {event.longitude}
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