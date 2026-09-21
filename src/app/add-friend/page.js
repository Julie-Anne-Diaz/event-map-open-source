"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addFriend } from "@/lib/api";
import { UserPlus } from "lucide-react";

export default function AddfriendPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await addFriend(email);
      if (response?.success) {
        setMessageType("success");
        setMessage("Friend request sent.");
        setEmail("");
      } else {
        setMessageType("error");
        setMessage("Failed to send friend request.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(`Error: ${error.message || "Failed to send friend request"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-28">
      <div className="dark-panel w-full max-w-md rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)] animate-enter">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/10 text-violet-300">
          <UserPlus size={22} />
        </div>
        <h1 className="mt-5 text-3xl font-black text-white">Add a friend</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Send a request by email and bring them into your Loop.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {message && (
            <p className={`rounded-xl border px-3 py-2 text-sm ${
              messageType === "success"
                ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/15 bg-red-400/10 text-red-300"
            }`}>
              {message}
            </p>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Friend's email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-dark" placeholder="friend@example.com" required />
          </div>

          <button type="submit" disabled={loading || !email} className="w-full rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Sending..." : "Send friend request"}
          </button>
        </form>
      </div>
    </main>
  );
}
