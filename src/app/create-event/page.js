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
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Failed to validate address.");
    const results = await response.json();
    if (!results || results.length === 0) throw new Error("Please enter a valid address.");
    return { latitude: Number(results[0].lat), longitude: Number(results[0].lon), displayName: results[0].display_name };
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
      await createEvent({
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
      });
      router.push("/events");
    } catch (error) {
      setMessage(`Error: ${error.message || "Failed to create event"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 pb-32 pt-9">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-900"><ArrowLeft size={16} />Back</button>

        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-700"><CalendarPlus size={16} /> Create on vidamobile</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Create an event</h1>
          <p className="mt-2 text-zinc-500">Add the details. We'll handle the pin.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="grid gap-6">
            <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Event title</label><input name="title" placeholder="Friday rooftop meetup" value={formData.title} onChange={handleChange} className="field-dark" required /></div>
            <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Description</label><textarea name="description" placeholder="What should people know?" value={formData.description} onChange={handleChange} className="field-dark min-h-28 resize-y" /></div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Visibility</label><select name="visibility" value={formData.visibility} onChange={handleChange} className="field-dark"><option value="public">Public</option><option value="invite_only">Invite Only</option><option value="private">Private</option></select></div>
              <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Capacity</label><input type="number" name="capacity" placeholder="Optional" value={formData.capacity} onChange={handleChange} className="field-dark" /></div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Starts</label><input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="field-dark" required /></div>
              <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Ends</label><input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="field-dark" required /></div>
            </div>

            <div className="rounded-xl bg-zinc-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-800"><MapPin size={17} className="text-violet-700" />Location</div>
              <div className="grid gap-4">
                <input name="location_name" placeholder="Venue name — e.g. Reitz Union" value={formData.location_name} onChange={handleChange} className="field-dark" required />
                <input name="address" placeholder="Full street address" value={formData.address} onChange={handleChange} className="field-dark" required />
              </div>
            </div>

            {message && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
            <button type="submit" disabled={loading} className="rounded-xl bg-[#242424] px-6 py-3.5 font-bold text-white transition hover:bg-black disabled:opacity-50">{loading ? "Creating..." : "Create event"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
