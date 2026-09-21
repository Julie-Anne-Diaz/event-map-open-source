"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const result = await loginUser(formData);
      localStorage.removeItem("token");
      localStorage.removeItem("currentUserId");
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("currentUserId", String(result.user_id));
      router.push("/events");
    } catch (error) {
      setMessage(`Error: ${error.message || "Failed to sign in"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(24,24,27,0.08)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[linear-gradient(145deg,#b6a3e7,#6d4bc8_52%,#38237d)] p-10 text-white md:flex md:flex-col md:justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold"><MapPinned size={20} /> vidamobile</Link>
          <div>
            <p className="text-3xl font-extrabold tracking-tight">Good plans are closer than you think.</p>
            <p className="mt-3 text-sm leading-6 text-white/80">Sign in to get back to your map, events, and friends.</p>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900 md:hidden"><MapPinned size={18} /> vidamobile</Link>
          <p className="text-sm font-bold text-violet-700">Welcome back</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-500">Pick up where you left off.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Email</label>
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="field-dark" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Password</label>
              <input type="password" name="password" placeholder="Your password" value={formData.password} onChange={handleChange} className="field-dark" required />
            </div>

            {message && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}

            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#242424] px-5 py-3.5 font-bold text-white transition hover:bg-black disabled:opacity-50">
              {loading ? "Signing in..." : "Continue"}
              {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-200 pt-6 text-center">
            <p className="text-sm text-zinc-500">New to vidamobile?</p>
            <Link href="/register" className="mt-2 inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100">Create an account</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
