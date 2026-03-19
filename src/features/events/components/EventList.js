"use client";

import { useEvents } from "../hooks/useEvents";

export default function EventList() {
  const { data, isLoading, isError } = useEvents();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Failed to load events.</p>;

  return (
    <ul className="space-y-4">
      {data.map((event) => (
        <li key={event.id} className="rounded-xl border p-4 shadow-sm">
          {event.name}
        </li>
      ))}
    </ul>
  );
}
