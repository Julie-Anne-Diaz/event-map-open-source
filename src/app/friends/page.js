"use client";
import { useState } from "react";
import Link from "next/link";

export default function Friends() {
  const [activeTab, setActiveTab] = useState("friends");
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 px-4">
      <div className="w-full max-w-3xl mx-auto py-12">

        {/* Toggle Bar */}
        <div className="flex justify-between mb-6">
          <div className="flex bg-gray-200 rounded-lg p-1">
            
            <Link
              href="/events"
              className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
            >
              Events
            </Link>
            <button
              onClick={() => setActiveTab("friends")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "friends"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Friends
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "friends" && (
           <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Friends</h2>
          <ul className="space-y-4">
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900">Alex Johnson</h3>
              <p className="text-gray-500 text-sm">3 upcoming events</p>
            </li>
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900">Maria Garcia</h3>
              <p className="text-gray-500 text-sm">1 upcoming event</p>
            </li>
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900">James Lee</h3>
              <p className="text-gray-500 text-sm">2 upcoming events</p>
            </li>
          </ul>
          </div>
        )}
    </main>
  );
}