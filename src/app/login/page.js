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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute left-[12%] top-[15%] h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[12%] right-[10%] h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="glass relative w-full max-w-md rounded-[2rem] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.42)] animate-enter sm:p-9">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
            <MapPinned size={18} />
          </span>
          Loop
        </Link>

        <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-300">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Sign in and find your next plan.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Your events, friends, and map are waiting.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="field-dark" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Password</label>
            <input type="password" name="password" placeholder="Your password" value={formData.password} onChange={handleChange} className="field-dark" required />
          </div>

          {message && (
            <p className="rounded-xl border border-red-400/15 bg-red-400/10 px-3 py-2 text-sm text-red-300">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-bold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Continue"}
            {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="mt-6 border-t border-white/[0.07] pt-6 text-center">
          <p className="text-sm text-slate-500">New to Loop?</p>
          <Link href="/register" className="mt-2 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
