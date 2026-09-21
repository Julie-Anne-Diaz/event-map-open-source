"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

export default function RegisterUserPage() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await registerUser({ email: formData.email, password: formData.password });
      localStorage.removeItem("token");
      localStorage.removeItem("currentUserId");
      router.push("/login");
    } catch (error) {
      setMessage(`Error: ${error.message || "Failed to register user"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[12%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="glass relative w-full max-w-md rounded-[2rem] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.42)] animate-enter sm:p-9">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <MapPinned size={18} />
            </span>
            Loop
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white"
          >
            Sign in instead
          </Link>
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-300">Join the loop</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Make the city feel a little smaller.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Create an account to discover events and make plans with friends.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="field-dark" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Password</label>
            <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className="field-dark" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Confirm password</label>
            <input type="password" name="confirmPassword" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} className="field-dark" required />
          </div>

          {message && (
            <p className="rounded-xl border border-red-400/15 bg-red-400/10 px-3 py-2 text-sm text-red-300">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-bold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
      </div>
    </main>
  );
}
