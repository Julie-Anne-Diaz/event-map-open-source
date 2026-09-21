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
    <main className="min-h-screen px-4 pb-32 pt-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex self-start rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
            <Link href="/events" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white">Events</Link>
            <button onClick={() => setActiveTab("friends")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === "friends" ? "bg-violet-500 text-white" : "text-slate-500 hover:text-white"}`}>Friends</button>
            <button onClick={() => setActiveTab("requests")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === "requests" ? "bg-violet-500 text-white" : "text-slate-500 hover:text-white"}`}>
              Requests {requests.length > 0 && `(${requests.length})`}
            </button>
          </div>

          <Link href="/add-friend" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-violet-300">
            <UserPlus size={16} />
            Add friend
          </Link>
        </div>

        {successMessage && <div className="mb-4 rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3 text-sm text-emerald-300">{successMessage}</div>}
        {error && <div className="mb-4 rounded-xl border border-red-400/15 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}

        {activeTab === "friends" && (
          <section>
            <div className="mb-6 animate-enter">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-300"><Users size={16} /> Your people</div>
              <h1 className="text-4xl font-black tracking-tight text-white">Friends</h1>
              <p className="mt-2 text-slate-400">The people you actually want to make plans with.</p>
            </div>

            {loadingFriends && <p className="text-slate-500">Loading friends...</p>}
            {!loadingFriends && friends.length === 0 && <div className="glass rounded-3xl p-9 text-center text-slate-500">No friends yet. Add someone and start making plans.</div>}

            {!loadingFriends && friends.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {friends.map((friend) => (
                  <article key={friend.id} className="card-lift dark-panel relative rounded-3xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/80 to-cyan-400/80 text-lg font-black text-white">
                        {friend.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-white">{friend.email?.split("@")[0]}</h2>
                        <p className="truncate text-sm text-slate-500">{friend.email}</p>
                      </div>
                    </div>

                    <div className="absolute right-4 top-4">
                      <button onClick={() => setOpenMenuId(openMenuId === friend.id ? null : friend.id)} className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white">
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === friend.id && (
                        <div className="absolute right-0 z-20 mt-1 w-64 rounded-2xl border border-white/10 bg-[#11151e] p-2 shadow-2xl">
                          <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">Invite to event</p>
                          {inviteOnlyEvents.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-slate-500">No invite-only events</p>
                          ) : (
                            inviteOnlyEvents.map((event) => (
                              <button key={event.id} onClick={() => handleInvite(friend.id, event.id)} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                                {event.title}
                              </button>
                            ))
                          )}
                          <div className="my-1 border-t border-white/[0.07]" />
                          <button onClick={() => handleRemoveFriend(friend.id)} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-400/10">Remove friend</button>
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
            <div className="mb-6 animate-enter">
              <p className="mb-2 text-sm font-semibold text-violet-300">New connections</p>
              <h1 className="text-4xl font-black tracking-tight text-white">Friend requests</h1>
            </div>

            {loadingRequests && <p className="text-slate-500">Loading requests...</p>}
            {!loadingRequests && requests.length === 0 && <div className="glass rounded-3xl p-9 text-center text-slate-500">No pending friend requests.</div>}

            {!loadingRequests && requests.length > 0 && (
              <div className="grid gap-4">
                {requests.map((request) => {
                  const sender = requestSenderMap[request.id];
                  return (
                    <article key={request.id} className="dark-panel rounded-3xl p-5 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-bold text-white">{sender?.email || "Someone"} wants to connect</h2>
                        <p className="mt-1 text-sm text-slate-500">Sent {new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <button onClick={() => handleAccept(request.id)} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">Accept</button>
                        <button onClick={() => handleDecline(request.id)} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-red-400/10 hover:text-red-300">Decline</button>
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
