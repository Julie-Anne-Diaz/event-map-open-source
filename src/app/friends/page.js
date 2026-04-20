"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFriends, getPendingFriendRequests, acceptFriendRequest, declineFriendRequest, getUser } from "@/lib/api";

export default function Friends() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requestSenderMap, setRequestSenderMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router]);

  async function loadData() {
    const currentUserId = localStorage.getItem("currentUserId");
    if (!currentUserId) return;

    // Load friends
    setLoadingFriends(true);
    try {
      const friendsData = await getFriends(currentUserId);
      setFriends(friendsData);
    } catch (err) {
      setError("Failed to fetch friends.");
    } finally {
      setLoadingFriends(false);
    }

    // Load pending requests
    setLoadingRequests(true);
    try {
      const requestsData = await getPendingFriendRequests();
      setRequests(requestsData);

      // Fetch sender details for each request
      const senderMap = {};
      for (const req of requestsData) {
        try {
          const sender = await getUser(req.sender_id);
          senderMap[req.id] = sender;
        } catch (err) {
          console.error("Failed to fetch sender details");
        }
      }
      setRequestSenderMap(senderMap);
    } catch (err) {
      // No pending requests or error
    } finally {
      setLoadingRequests(false);
    }
  }

  async function handleAccept(requestId) {
    try {
      await acceptFriendRequest(requestId);
      setSuccessMessage("Friend request accepted!");
      setRequests(requests.filter((r) => r.id !== requestId));
      loadData(); // Refresh friends list
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDecline(requestId) {
    try {
      await declineFriendRequest(requestId);
      setSuccessMessage("Friend request declined.");
      setRequests(requests.filter((r) => r.id !== requestId));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

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
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "requests"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Requests {requests.length > 0 && `(${requests.length})`}
            </button>
          </div>
          <Link
            href="/add-friend"
            className="bg-black text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            + Add Friend
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Friends</h1>

            {loadingFriends && <p className="text-gray-600">Loading friends...</p>}

            {!loadingFriends && friends.length === 0 && (
              <p className="text-gray-600">No friends yet. Start adding friends!</p>
            )}

            {!loadingFriends && friends.length > 0 && (
              <div className="grid gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      User #{friend.id}
                    </h2>
                    <p className="text-gray-600 mt-1">{friend.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Friend Requests</h1>

            {loadingRequests && <p className="text-gray-600">Loading requests...</p>}

            {!loadingRequests && requests.length === 0 && (
              <p className="text-gray-600">No pending friend requests.</p>
            )}

            {!loadingRequests && requests.length > 0 && (
              <div className="grid gap-4">
                {requests.map((request) => {
                  const sender = requestSenderMap[request.id];
                  return (
                    <div
                      key={request.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">
                            Friend Request
                          </h2>
                          {sender && (
                            <>
                              <p className="text-gray-600 mt-1">From: {sender.email}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Sent on {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(request.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(request.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

