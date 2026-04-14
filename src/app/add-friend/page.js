"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFriend } from "@/services/api";  

export default function AddfriendPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await addFriend(email);
            if (response?.success) {
                setMessage("Friend request sent successfully!");
            } else {
                setMessage("Failed to send friend request.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a Friend</h1>
                <p className="text-gray-500 text-sm mb-6">Enter your friend's email to send a friend request.</p> 
                <div className="space-y-4">
                    {message && (
                        <p className={`text-sm ${message.includes("successfully") ? "text-green-500 bg-green-50 border border-green-200" : "text-red-500 bg-red-50 border border-red-200"} rounded-lg px-3 py-2`}>
                            {message}
                        </p>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-3 rounded-lg transition-colors outline-none bg-white text-black border-gray-300 placeholder:text-gray-500"
                            placeholder="user@example.com"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Friend Request"}
                    </button>
                </div>
            </div> 
        </main>
    );
}   
