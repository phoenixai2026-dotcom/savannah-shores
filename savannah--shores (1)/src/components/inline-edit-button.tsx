"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import type { Listing } from "@/db/schema";

export function InlineEditButton({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      location: String(form.get("location") ?? ""),
      durationDays: Number(form.get("durationDays") ?? 1),
      priceUsd: Number(form.get("priceUsd") ?? 100),
      tagline: String(form.get("tagline") ?? ""),
      description: String(form.get("description") ?? ""),
      imageUrl: String(form.get("imageUrl") ?? ""),
      tripadvisorRating: Number(form.get("tripadvisorRating") ?? 4.9),
      tripadvisorReviewCount: Number(form.get("tripadvisorReviewCount") ?? 100),
      tripadvisorUrl: String(form.get("tripadvisorUrl") ?? ""),
      tripadvisorAward: String(form.get("tripadvisorAward") ?? ""),
      featured: form.get("featured") === "on",
    };

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to save package.");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-savanna-500/40 bg-savanna-500/10 px-3 py-1.5 text-xs font-semibold text-savanna-700 transition hover:bg-savanna-500 hover:text-white"
        title={`Edit ${listing.name}`}
      >
        <span>✎ Edit</span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/60 p-4 backdrop-blur-xs"
              onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
              }}
            >
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 text-stone-900 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-savanna-600">
                      Edit Package
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">
                      {listing.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-lg text-stone-600 hover:bg-stone-200"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSave} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Package Name</label>
                      <input
                        name="name"
                        defaultValue={listing.name}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Location</label>
                      <input
                        name="location"
                        defaultValue={listing.location}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="label">Price per person (USD)</label>
                      <input
                        name="priceUsd"
                        type="number"
                        min={1}
                        defaultValue={listing.priceUsd}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Duration (Days)</label>
                      <input
                        name="durationDays"
                        type="number"
                        min={1}
                        defaultValue={listing.durationDays}
                        required
                        className="input"
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-800">
                        <input
                          name="featured"
                          type="checkbox"
                          defaultChecked={listing.featured}
                          className="h-4 w-4 accent-savanna-600"
                        />
                        Featured on homepage
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label">Tagline</label>
                    <input
                      name="tagline"
                      defaultValue={listing.tagline}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Full Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={listing.description}
                      required
                      className="input"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="label">TripAdvisor Rating (1-5)</label>
                      <input
                        name="tripadvisorRating"
                        type="number"
                        step="0.1"
                        min={1}
                        max={5}
                        defaultValue={listing.tripadvisorRating}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">TripAdvisor Review Count</label>
                      <input
                        name="tripadvisorReviewCount"
                        type="number"
                        min={0}
                        defaultValue={listing.tripadvisorReviewCount}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Award Badge</label>
                      <input
                        name="tripadvisorAward"
                        defaultValue={listing.tripadvisorAward ?? ""}
                        placeholder="Travellers' Choice 2025"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Image URL</label>
                      <input
                        name="imageUrl"
                        defaultValue={listing.imageUrl}
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">TripAdvisor URL</label>
                      <input
                        name="tripadvisorUrl"
                        defaultValue={listing.tripadvisorUrl}
                        className="input"
                      />
                    </div>
                  </div>

                  {error ? (
                    <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="btn-secondary !py-2.5 !text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary !py-2.5 !text-sm"
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
