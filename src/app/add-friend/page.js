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
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 pb-28">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700"><UserPlus size={22} /></div>
        <h1 className="mt-5 text-3xl font-extrabold text-zinc-900">Add a friend</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">Send a request by email and bring them into vidamobile.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {message && <p className={`rounded-xl border px-3 py-2 text-sm ${messageType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message}</p>}
          <div><label className="mb-2 block text-sm font-semibold text-zinc-700">Friend's email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-dark" placeholder="friend@example.com" required /></div>
          <button type="submit" disabled={loading || !email} className="w-full rounded-xl bg-[#242424] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50">{loading ? "Sending..." : "Send friend request"}</button>
        </form>
      </div>
    </main>
  );
}
