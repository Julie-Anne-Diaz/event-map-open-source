"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import { loginUser } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {loading ? "Submitting..." : "Continue"}
          </button>
          <Link
            href="/register"
            className="block text-center text-sm text-gray-600 hover:text-gray-800"
          >
            Don't have an account? Sign Up
          </Link>
      
        </form>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>
    </main>
  );
}


