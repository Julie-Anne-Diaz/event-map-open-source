"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginPage() { 
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const router = useRouter();

    function handleSubmit(){
        console.log("Email:", email);
        console.log("Password:", password);
        router.push("/events");
    }
    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back!</h1> 
                <p className="text-gray-500 text-sm mb-6"> Sign in to your account</p>
                
                <div className="space-y-4">
                    {/*Email Input*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            placeholder="youremail@example.com"
                            className="w-full border border-gray-300 rounded-lg py-4 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    {/*Password Input*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-lg py-4 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    {/*Sign In Button*/}
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-black text-white py-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Sign In
                        </button>
                    <p className="text-sm text-gray-500 text-center mt-6">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-black font-medium hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </main>
    )
}