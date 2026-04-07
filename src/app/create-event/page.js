"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api";

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
    start_time: "",
    end_time: "",
    capacity: "",
    location_name: "",
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function inputClass(value) {
    return `w-full border p-3 rounded-lg transition-colors outline-none ${
      value
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-black border-gray-300 placeholder:text-gray-500"
    }`;
  }

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  const currentUserId = localStorage.getItem("currentUserId");

  if (!currentUserId) {
    setMessage("No logged-in user found. Please sign in first.");
    setLoading(false);
    return;
  }

  try {
    const payload = {
      creator_user_id: Number(currentUserId),
      title: formData.title,
      description: formData.description,
      visibility: formData.visibility,
      start_time: `${formData.start_time}:00`,
      end_time: `${formData.end_time}:00`,
      capacity: formData.capacity ? Number(formData.capacity) : null,
      location_name: formData.location_name,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    await createEvent(payload);
    router.push("/events");
  } catch (error) {
    setMessage(`Error: ${error.message || "Failed to create event"}`);
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass(formData.title)}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className={inputClass(formData.description)}
          />

          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className={inputClass(formData.visibility)}
          >
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="invite_only">Invite Only</option>
            <option value="private">Private</option>
          </select>

          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className={inputClass(formData.start_time)}
            required
          />

          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className={inputClass(formData.end_time)}
            required
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={inputClass(formData.capacity)}
          />

          <input
            name="location_name"
            placeholder="Location Name"
            value={formData.location_name}
            onChange={handleChange}
            className={inputClass(formData.location_name)}
            required
          />

          <input
            type="number"
            step="any"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            className={inputClass(formData.latitude)}
            required
          />

          <input
            type="number"
            step="any"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            className={inputClass(formData.longitude)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </main>
  );
}