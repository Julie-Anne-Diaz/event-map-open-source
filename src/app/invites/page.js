"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getInvites, acceptEventInvite, declineEventInvite } from "@/lib/api";
import { MailOpen } from "lucide-react";

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
      setInvites(await getInvites());
    } catch {
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
    <main className="min-h-screen bg-[#f7f7f8] px-4 pb-32 pt-9">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-7 inline-flex rounded-xl border border-zinc-200 bg-white p-1">
          <Link href="/events" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">Events</Link>
          <Link href="/friends" className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">Friends</Link>
          <span className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Invites</span>
        </div>

        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-700"><MailOpen size={16} /> vidamobile invites</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Plans waiting on you</h1>
          <p className="mt-2 text-zinc-500">Accept the ones that sound good. Pass on the rest.</p>
        </div>

        {successMessage && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</p>}
        {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-sm text-zinc-500">Loading invites...</p>}

        {!loading && invites.length === 0 && <div className="rounded-2xl border border-zinc-200 bg-white p-9 text-center text-zinc-500">No event invites right now.</div>}

        {!loading && invites.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {invites.map((invite) => (
              <article key={invite.id} className="card-lift rounded-2xl border border-zinc-200 bg-white p-6">
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">{invite.status}</span>
                <h2 className="mt-4 text-xl font-bold text-zinc-900">{invite.event_title}</h2>
                <p className="mt-2 text-sm text-zinc-500">Invited by {invite.creator_email}</p>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => handleAccept(invite.id)} className="flex-1 rounded-lg bg-[#242424] px-4 py-2.5 text-sm font-bold text-white hover:bg-black">Accept</button>
                  <button onClick={() => handleDecline(invite.id)} className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100">Decline</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
