"use client";
import { useState } from "react";
import Link from "next/link";

export default function Events() {
    const [activeTab, setActiveTab] = useState("events");
    return (
    <main className="min-h-screen flex flex-col bg-gray-50 px-4">
        <div className="w-full max-w-3xl mx-auto py-12">

        {/* Toggle Bar */}
        <div className="flex justify-start mb-6">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "events"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Events
            </button>
            <Link
              href="/friends"
              className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
            >
              Friends
            </Link>
          </div>
        </div>
        {/* Content */}
        {activeTab === "events" && (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <ul className="space-y-4">
                <li className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900">Music Festival</h3>
                    <p className="text-gray-500">Saturday, June 15th at Central Park</p>
                </li>           
                <li className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900">Art Exhibition</h3>     
                    <p className="text-gray-500">Friday, June 21st at Downtown Gallery</p>  
                </li>                       

                <li className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900">Food Truck Festival</h3>
                    <p className="text-gray-500">Sunday, June 30th at City Square</p>   
                </li>
                 
                 <li className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900">Film Screening</h3>
                    <p className="text-gray-500">Saturday, July 6th at Cinema Hall</p>   
                </li>

                 <li className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900">Dance Performance</h3>
                    <p className="text-gray-500">Saturday, July 13th at Theater</p>   
                </li>
            </ul>
        </div>
        )}
    </div>
    </main>
  );
}   
