"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/services/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "signup") {
                const createdUser = await registerUser(email, password);
                if (createdUser?.id) {
                    localStorage.setItem("currentUserId", String(createdUser.id));
                }
            }

            const loginData = await loginUser(email, password);
            localStorage.setItem("token", loginData.access_token);
            router.push("/events");
        } catch (err) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
    }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {mode === "login" ? "Welcome back!" : "Create your account"}
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    {mode === "login" ? "Sign in to your account" : "Sign up to get started"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="youremail@example.com"
                            className="w-full border border-gray-300 rounded-lg py-4 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-lg py-4 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        className="text-black font-medium hover:underline"
                    >
                        {mode === "login" ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </div>
        </main>
    );
}