"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getInvites, acceptEventInvite, declineEventInvite } from "@/lib/api";

export default function InvitesPage() {
  const router = useRouter();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadInvites();
  }, [router]);

  async function loadInvites() {
    setLoading(true);
    setError("");
    try {
      const data = await getInvites();
      setInvites(data);
    } catch (err) {
      setError("Failed to load invites.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(inviteId) {
    try {
      await acceptEventInvite(inviteId);
      setSuccessMessage("Invite accepted. You can now see the event.");
      setInvites(invites.filter((invite) => invite.id !== inviteId));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to accept invite.");
    }
  }

  async function handleDecline(inviteId) {
    try {
      await declineEventInvite(inviteId);
      setSuccessMessage("Invite declined.");
      setInvites(invites.filter((invite) => invite.id !== inviteId));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to decline invite.");
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 px-4">
      <div className="w-full max-w-3xl mx-auto py-12">
        <div className="flex justify-between mb-6">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <Link
              href="/events"
              className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
            >
              Events
            </Link>
            <Link
              href="/friends"
              className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
            >
              Friends
            </Link>
            <button className="px-3 py-1 rounded-lg text-xs font-medium bg-black text-white shadow-sm">
              Invites
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Event Invites</h1>

          {successMessage && (
            <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          {loading && <p className="text-gray-600">Loading invites...</p>}

          {!loading && invites.length === 0 && (
            <p className="text-gray-600">No event invites received.</p>
          )}

          {!loading && invites.length > 0 && (
            <div className="grid gap-4">
              {invites.map((invite) => (
                <div key={invite.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{invite.event_title}</h2>
                      <p className="text-sm text-gray-600">From: {invite.creator_email}</p>
                      <p className="text-sm text-gray-600">Event ID: {invite.event_id}</p>
                      <p className="text-sm text-gray-600">Status: {invite.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(invite.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(invite.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
