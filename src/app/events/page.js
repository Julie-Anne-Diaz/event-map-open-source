"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEvents, getUsers } from "@/lib/api";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [eventError, setEventError] = useState("");
  const [userError, setUserError] = useState("");

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

    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setUserError("Failed to load users");
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadEvents();
    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-5 py-2 rounded-lg font-medium ${
              activeTab === "events"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            Events
          </button>

          <button
            onClick={() => setActiveTab("friends")}
            className={`px-5 py-2 rounded-lg font-medium ${
              activeTab === "friends"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            Friends
          </button>

          <Link
            href="/create-event"
            className="px-5 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Create Event
          </Link>
        </div>

        {activeTab === "events" && (
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
        )}

        {activeTab === "friends" && (
          <section>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>

            {loadingUsers && <p className="text-gray-600">Loading users...</p>}
            {userError && <p className="text-red-600">{userError}</p>}

            {!loadingUsers && !userError && users.length === 0 && (
              <p className="text-gray-600">No users found yet.</p>
            )}

            {!loadingUsers && !userError && users.length > 0 && (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      User #{user.id}
                    </h2>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}