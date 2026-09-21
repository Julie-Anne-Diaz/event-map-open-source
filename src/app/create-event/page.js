"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api";
import { ArrowLeft, CalendarPlus, MapPin } from "lucide-react";

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
    address: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function geocodeAddress(address) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) throw new Error("Failed to validate address.");
    const results = await response.json();
    if (!results || results.length === 0) throw new Error("Please enter a valid address.");

    return {
      latitude: Number(results[0].lat),
      longitude: Number(results[0].lon),
      displayName: results[0].display_name,
    };
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

    if (!formData.address.trim()) {
      setMessage("Please enter a valid address.");
      setLoading(false);
      return;
    }

    try {
      const geocoded = await geocodeAddress(formData.address);
      const payload = {
        creator_user_id: Number(currentUserId),
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
        start_time: `${formData.start_time}:00`,
        end_time: `${formData.end_time}:00`,
        capacity: formData.capacity ? Number(formData.capacity) : null,
        location_name: formData.location_name || geocoded.displayName,
        latitude: geocoded.latitude,
        longitude: geocoded.longitude,
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
    <main className="min-h-screen px-4 pb-32 pt-8">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-white">
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-7 animate-enter">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-300">
            <CalendarPlus size={16} />
            Add something worth showing up for
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Create an event</h1>
          <p className="mt-2 text-slate-400">Give people the details. Loop will put it on the map.</p>
        </div>

        <form onSubmit={handleSubmit} className="dark-panel rounded-[2rem] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Event title</label>
              <input name="title" placeholder="Friday rooftop meetup" value={formData.title} onChange={handleChange} className="field-dark" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Description</label>
              <textarea name="description" placeholder="What should people know?" value={formData.description} onChange={handleChange} className="field-dark min-h-28 resize-y" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Visibility</label>
                <select name="visibility" value={formData.visibility} onChange={handleChange} className="field-dark">
                  <option value="public">Public</option>
                  <option value="invite_only">Invite Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Capacity</label>
                <input type="number" name="capacity" placeholder="Optional" value={formData.capacity} onChange={handleChange} className="field-dark" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Starts</label>
                <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="field-dark [color-scheme:dark]" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Ends</label>
                <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="field-dark [color-scheme:dark]" required />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
                <MapPin size={17} className="text-cyan-300" />
                Location
              </div>
              <div className="grid gap-4">
                <input name="location_name" placeholder="Venue name — e.g. Reitz Union" value={formData.location_name} onChange={handleChange} className="field-dark" required />
                <input name="address" placeholder="Full street address" value={formData.address} onChange={handleChange} className="field-dark" required />
              </div>
            </div>

            {message && (
              <p className="rounded-xl border border-red-400/15 bg-red-400/10 px-3 py-2 text-sm text-red-300">{message}</p>
            )}

            <button type="submit" disabled={loading} className="rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Creating..." : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
