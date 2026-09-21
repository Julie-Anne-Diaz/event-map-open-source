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
      const data = await getInvites();
      setInvites(data);
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
    <main className="min-h-screen px-4 pb-32 pt-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-7 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
          <Link href="/events" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white">Events</Link>
          <Link href="/friends" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.06] hover:text-white">Friends</Link>
          <span className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white">Invites</span>
        </div>

        <div className="mb-7 animate-enter">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-300">
            <MailOpen size={16} />
            Plans waiting on you
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Event invites</h1>
          <p className="mt-2 text-slate-400">Accept the plans that sound good. Ignore the rest.</p>
        </div>

        {successMessage && <p className="mb-4 rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3 text-sm text-emerald-300">{successMessage}</p>}
        {error && <p className="mb-4 rounded-xl border border-red-400/15 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}

        {loading && <p className="text-sm text-slate-500">Loading invites...</p>}

        {!loading && invites.length === 0 && (
          <div className="glass rounded-3xl p-9 text-center text-slate-500">No event invites right now.</div>
        )}

        {!loading && invites.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {invites.map((invite) => (
              <article key={invite.id} className="card-lift dark-panel rounded-3xl p-6">
                <span className="rounded-full border border-violet-400/15 bg-violet-400/10 px-2.5 py-1 text-xs font-bold text-violet-300">{invite.status}</span>
                <h2 className="mt-4 text-xl font-bold text-white">{invite.event_title}</h2>
                <p className="mt-2 text-sm text-slate-400">Invited by {invite.creator_email}</p>

                <div className="mt-6 flex gap-2">
                  <button onClick={() => handleAccept(invite.id)} className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">Accept</button>
                  <button onClick={() => handleDecline(invite.id)} className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300">Decline</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
