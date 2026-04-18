"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers } from "@/lib/api";

export default function Friends() {
  const [activeTab, setActiveTab] = useState("friends");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState("");
  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      setUserError("");
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setUserError("Failed to fetch users.");
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);
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
          <Link
            href="/add-friend"
            className="bg-black text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            + Add Friend
          </Link>
        </div>
      </div>
        {/* Content */}
        {activeTab === "friends" && (
           <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Friends</h1>

            {loadingUsers && <p className="text-gray-600">Loading friends...</p>}
            {userError && <p className="text-red-600">{userError}</p>}

            {!loadingUsers && !userError && users.length === 0 && (
              <p className="text-gray-600">No friends found yet.</p>
            )}

            {!loadingUsers && !userError && users.length > 0 && (
              <div className="overflow-y-auto max-h-[60vh] pr-2 grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      User #{user.id}
                    </h2>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </main>
    
  );
  }

