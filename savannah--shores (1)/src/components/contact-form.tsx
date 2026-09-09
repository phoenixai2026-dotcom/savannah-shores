"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Could not send your message.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-mpesa/40 bg-mpesa/10 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-stone-900">Message received!</p>
        <p className="mt-2 text-stone-600">
          Our team will reply within a few hours. For anything urgent, call {site.phoneDisplay}.
        </p>
        <button type="button" className="btn-secondary mt-5" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone / WhatsApp (optional)</label>
          <input id="phone" name="phone" type="tel" className="input" placeholder="+254 7XX XXX XXX" />
        </div>
        <div>
          <label className="label" htmlFor="subject">I'm interested in</label>
          <select id="subject" name="subject" className="input" defaultValue="Safari enquiry">
            <option>Safari enquiry</option>
            <option>Beach holiday enquiry</option>
            <option>Safari + beach combination</option>
            <option>Payment question (Visa / M-Pesa)</option>
            <option>Existing booking</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} required className="input" placeholder="Tell us your dates, group size and what you'd love to see…" />
      </div>
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
