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
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(24,24,27,0.08)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[linear-gradient(145deg,#b6a3e7,#6d4bc8_52%,#38237d)] p-10 text-white md:flex md:flex-col md:justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold"><MapPinned size={20} /> vidamobile</Link>
          <div>
            <p className="text-3xl font-extrabold tracking-tight">A better way to see what's going on.</p>
            <p className="mt-3 text-sm leading-6 text-white/80">Create an account and start finding events around you.</p>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8 flex items-center justify-between gap-4 md:justify-end">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900 md:hidden"><MapPinned size={18} /> vidamobile</Link>
            <Link href="/login" className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100">Sign in instead</Link>
          </div>

          <p className="text-sm font-bold text-violet-700">Join vidamobile</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900">Create your account</h1>
          <p className="mt-2 text-sm text-zinc-500">You'll be on the map in a minute.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Email</label>
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="field-dark" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Password</label>
              <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className="field-dark" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Confirm password</label>
              <input type="password" name="confirmPassword" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} className="field-dark" required />
            </div>

            {message && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}

            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#242424] px-5 py-3.5 font-bold text-white transition hover:bg-black disabled:opacity-50">
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
