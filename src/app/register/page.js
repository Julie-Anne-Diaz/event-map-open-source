"use client";   

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function RegisterUserPage() {
    const [formData, setFormData]= useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const result = await registerUser({
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem("currentUserId", result.id);
            router.push("/events");
        } catch(error){
            setMessage(`Error: ${error.message || "Failed to register user"}`);
        } finally {
            setLoading(false);
        }
        }
    
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6"> Sign Up/ Register</h1>
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

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        value={formData.confirmPassword || ""}
                        className ="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-lg p-3 font-medium hover:bg-gray-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>
                {message && <p className="text-red-600 mt-4">{message}</p>}
            </div>
        </main>
     );
    }
