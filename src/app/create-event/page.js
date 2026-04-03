"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/api";

export default function CreateEventPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
        setError("");
        setLoading(true);
        try {
            await createEvent({ title, description, date, location });
            router.push("/events");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 pb-20">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Event</h1>
                <p className="text-gray-500 text-sm mb-6">Fill in the details below to create your event</p>

                <div className="space-y-4">
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title
                            </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter event title"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 
                            focus:ring-black"
                            placeholder="Enter event description"
                            rows={3}
                        />
                    </div>

                    {/* Date Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date & Time</label>
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Location Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter event location"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Event"}
                    </button>

                </div>
            </div>
        </main>
    );
}