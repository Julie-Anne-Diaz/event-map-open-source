"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getFriends,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getUser,
  getUserEvents,
  inviteFriendToEvent,
  removeFriend,
} from "@/lib/api";
import { MoreVertical, UserPlus, Users } from "lucide-react";

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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [inviteOnlyEvents, setInviteOnlyEvents] = useState([]);

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

    setLoadingFriends(true);
    try {
      const friendsData = await getFriends(currentUserId);
      setFriends(friendsData);
      const myEvents = await getUserEvents(currentUserId);
      setInviteOnlyEvents(myEvents.filter((event) => event.visibility === "invite_only"));
    } catch {
      setError("Failed to fetch friends.");
    } finally {
      setLoadingFriends(false);
    }

    setLoadingRequests(true);
    try {
      const requestsData = await getPendingFriendRequests();
      setRequests(requestsData);
      const senderMap = {};
      for (const req of requestsData) {
        try {
          senderMap[req.id] = await getUser(req.sender_id);
        } catch {
          console.error("Failed to fetch sender details");
        }
      }
      setRequestSenderMap(senderMap);
    } catch {
      // No pending requests or request fetch failed.
    } finally {
      setLoadingRequests(false);
    }
  }

  async function handleAccept(requestId) {
    try {
      await acceptFriendRequest(requestId);
      setSuccessMessage("Friend request accepted.");
      setRequests(requests.filter((r) => r.id !== requestId));
      loadData();
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

  async function handleInvite(friendId, eventId) {
    try {
      await inviteFriendToEvent(eventId, friendId);
      setSuccessMessage("Friend invited.");
      setOpenMenuId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemoveFriend(friendId) {
    try {
      await removeFriend(friendId);
      setFriends(friends.filter((friend) => friend.id !== friendId));
      setSuccessMessage("Friend removed.");
      setOpenMenuId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 pb-32 pt-9">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex self-start rounded-xl border border-zinc-200 bg-white p-1">
            <Link href="/events" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900">Events</Link>
            <button onClick={() => setActiveTab("friends")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "friends" ? "bg-violet-700 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}>Friends</button>
            <button onClick={() => setActiveTab("requests")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "requests" ? "bg-violet-700 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}>
              Requests {requests.length > 0 && `(${requests.length})`}
            </button>
          </div>

          <Link href="/add-friend" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#242424] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black">
            <UserPlus size={16} />
            Add friend
          </Link>
        </div>

        {successMessage && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div>}
        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {activeTab === "friends" && (
          <section>
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-700"><Users size={16} /> vidamobile friends</div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Your people</h1>
              <p className="mt-2 text-zinc-500">Keep the people you make plans with close.</p>
            </div>

            {loadingFriends && <p className="text-zinc-500">Loading friends...</p>}
            {!loadingFriends && friends.length === 0 && <div className="rounded-2xl border border-zinc-200 bg-white p-9 text-center text-zinc-500">No friends yet. Add someone and start making plans.</div>}

            {!loadingFriends && friends.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {friends.map((friend) => (
                  <article key={friend.id} className="card-lift relative rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-lg font-black text-violet-700">
                        {friend.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-zinc-900">{friend.email?.split("@")[0]}</h2>
                        <p className="truncate text-sm text-zinc-500">{friend.email}</p>
                      </div>
                    </div>

                    <div className="absolute right-4 top-4">
                      <button onClick={() => setOpenMenuId(openMenuId === friend.id ? null : friend.id)} className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-800">
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === friend.id && (
                        <div className="absolute right-0 z-20 mt-1 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
                          <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-zinc-400">Invite to event</p>
                          {inviteOnlyEvents.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-zinc-500">No invite-only events</p>
                          ) : (
                            inviteOnlyEvents.map((event) => (
                              <button key={event.id} onClick={() => handleInvite(friend.id, event.id)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100">
                                {event.title}
                              </button>
                            ))
                          )}
                          <div className="my-1 border-t border-zinc-200" />
                          <button onClick={() => handleRemoveFriend(friend.id)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50">Remove friend</button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "requests" && (
          <section>
            <div className="mb-6">
              <p className="mb-2 text-sm font-bold text-violet-700">New connections</p>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Friend requests</h1>
            </div>

            {loadingRequests && <p className="text-zinc-500">Loading requests...</p>}
            {!loadingRequests && requests.length === 0 && <div className="rounded-2xl border border-zinc-200 bg-white p-9 text-center text-zinc-500">No pending friend requests.</div>}

            {!loadingRequests && requests.length > 0 && (
              <div className="grid gap-4">
                {requests.map((request) => {
                  const sender = requestSenderMap[request.id];
                  return (
                    <article key={request.id} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-bold text-zinc-900">{sender?.email || "Someone"} wants to connect</h2>
                        <p className="mt-1 text-sm text-zinc-500">Sent {new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <button onClick={() => handleAccept(request.id)} className="rounded-lg bg-[#242424] px-4 py-2 text-sm font-bold text-white hover:bg-black">Accept</button>
                        <button onClick={() => handleDecline(request.id)} className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100">Decline</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
