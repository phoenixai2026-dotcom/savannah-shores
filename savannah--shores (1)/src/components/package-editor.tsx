"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Listing } from "@/db/schema";
import { formatUsd, whatsappLink } from "@/lib/site";

export function PackageEditorSection({
  initialListings,
}: {
  initialListings: Listing[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const editId = Number(searchParams.get("edit"));
    if (editId) {
      const found = listings.find((l) => l.id === editId);
      if (found) setEditing(found);
    }
  }, [searchParams, listings]);

  function getFullUrl(path: string) {
    if (!origin) return path;
    return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  }

  async function copyLink(key: string, path: string) {
    const url = getFullUrl(path);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);

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
      const res = await fetch(`/api/listings/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; listing?: Listing; error?: string };
      if (!res.ok || !data.listing) {
        throw new Error(data.error ?? "Failed to update package.");
      }
      setListings((prev) =>
        prev.map((item) => (item.id === editing.id ? data.listing! : item)),
      );
      setEditing(null);
      setMessage(`Saved changes to "${data.listing.name}".`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error saving package.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div id="package-editor" className="mt-12 scroll-mt-24">
      {/* Quick Share Links Bar */}
      <div className="rounded-3xl border border-savanna-500/30 bg-sand-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-savanna-600">
              Shareable Links Hub
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-stone-900">
              Copy & Share Site Links
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Click any button below to copy its live share link or share directly on WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { key: "home", label: "Main Website Home", path: "/" },
            { key: "safaris", label: "All Kenya Safaris", path: "/safaris" },
            { key: "beach", label: "All Beach Holidays", path: "/beach" },
            { key: "reviews", label: "Tripadvisor Reviews", path: "/reviews" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-xs"
            >
              <div>
                <p className="font-semibold text-stone-900">{item.label}</p>
                <p className="mt-1 truncate font-mono text-xs text-stone-500">
                  {getFullUrl(item.path)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyLink(item.key, item.path)}
                  className="flex-1 cursor-pointer rounded-xl bg-savanna-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-savanna-600"
                >
                  {copiedId === item.key ? "Copied!" : "Copy Share Link"}
                </button>
                <a
                  href={whatsappLink(
                    `Explore ${item.label} on Savanna & Shores Kenya: ${getFullUrl(item.path)}`,
                    "web",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-mpesa px-3 py-2 text-xs font-semibold text-white transition hover:bg-mpesa-dark"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages list with Share & Edit */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-stone-900">
            Safari & Beach Packages — Share Links & Edit
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Every package has its own share link and an <strong>Edit Package</strong> button to customize titles, prices, TripAdvisor ratings, and descriptions.
          </p>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl border border-mpesa/40 bg-mpesa/10 px-4 py-3 text-sm font-medium text-stone-800">
          {message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {listings.map((pkg) => {
          const pkgPath = `/packages/${pkg.slug}`;
          const copyKey = `pkg-${pkg.id}`;
          return (
            <div
              key={pkg.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  className="h-20 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-stone-700">
                      {pkg.category}
                    </span>
                    <span className="text-xs font-semibold text-ta-dark">
                      ★ {pkg.tripadvisorRating.toFixed(1)} ({pkg.tripadvisorReviewCount})
                    </span>
                  </div>
                  <h3 className="mt-1 truncate font-display text-lg font-semibold text-stone-900">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {pkg.durationDays} days · {formatUsd(pkg.priceUsd)} / person
                  </p>
                  <p className="mt-1 truncate font-mono text-[11px] text-stone-400">
                    {getFullUrl(pkgPath)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
                <button
                  type="button"
                  onClick={() => copyLink(copyKey, pkgPath)}
                  className="cursor-pointer rounded-xl bg-savanna-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-savanna-600"
                >
                  {copiedId === copyKey ? "Link Copied!" : "Copy Share Link"}
                </button>
                <a
                  href={whatsappLink(
                    `Check out ${pkg.name} (${formatUsd(pkg.priceUsd)}): ${getFullUrl(pkgPath)}`,
                    "web",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-mpesa px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-mpesa-dark"
                >
                  Share on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setEditing(pkg)}
                  className="ml-auto cursor-pointer rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-800 transition hover:border-savanna-500 hover:bg-white"
                >
                  Edit Package
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/60 p-4 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 text-stone-900 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-savanna-600">
                  Editing Package #{editing.id}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">
                  {editing.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
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
                    defaultValue={editing.name}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input
                    name="location"
                    defaultValue={editing.location}
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
                    defaultValue={editing.priceUsd}
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
                    defaultValue={editing.durationDays}
                    required
                    className="input"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-800">
                    <input
                      name="featured"
                      type="checkbox"
                      defaultChecked={editing.featured}
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
                  defaultValue={editing.tagline}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Full Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editing.description}
                  required
                  className="input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">TripAdvisor Rating (1.0 - 5.0)</label>
                  <input
                    name="tripadvisorRating"
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    defaultValue={editing.tripadvisorRating}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">TripAdvisor Reviews</label>
                  <input
                    name="tripadvisorReviewCount"
                    type="number"
                    min={0}
                    defaultValue={editing.tripadvisorReviewCount}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">TripAdvisor Award Badge</label>
                  <input
                    name="tripadvisorAward"
                    defaultValue={editing.tripadvisorAward ?? ""}
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
                    defaultValue={editing.imageUrl}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">TripAdvisor URL</label>
                  <input
                    name="tripadvisorUrl"
                    defaultValue={editing.tripadvisorUrl}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
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
        </div>
      ) : null}
    </div>
  );
}
