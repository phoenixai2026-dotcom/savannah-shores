"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

type ShareLinkProps = {
  title: string;
  path?: string;
  listingId?: number;
  className?: string;
  label?: string;
  compact?: boolean;
};

export function ShareLinkButton({
  title,
  path,
  listingId,
  className = "",
  label = "Share link",
  compact = false,
}: ShareLinkProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl = path
    ? origin
      ? `${origin}${path.startsWith("/") ? path : `/${path}`}`
      : path
    : typeof window !== "undefined"
      ? window.location.href
      : "";

  async function copyToClipboard() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        inputRef.current?.select();
        document.execCommand("copy");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      inputRef.current?.select();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          `inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white ${
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          } font-semibold text-stone-800 shadow-sm transition hover:border-savanna-500 hover:text-savanna-600`
        }
        title={`Share ${title}`}
      >
        <ShareIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        <span>{label}</span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/60 p-4 backdrop-blur-xs"
              onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 text-stone-900 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-savanna-600">
                      Share & Edit
                    </p>
                    <h3 id={titleId} className="mt-1 font-display text-2xl font-semibold">
                      {title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-lg text-stone-600 hover:bg-stone-200"
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5">
                  <label htmlFor={inputId} className="label">
                    Shareable link
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      id={inputId}
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className="input min-w-0 !px-3 !py-2.5 font-mono !text-xs"
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="shrink-0 cursor-pointer rounded-xl bg-savanna-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-savanna-600"
                    >
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={whatsappLink(`Check out ${title} on ${site.name}: ${shareUrl}`, "web")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-mpesa px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-mpesa-dark"
                  >
                    Share on WhatsApp
                  </a>
                  {listingId ? (
                    <Link
                      href={`/admin?edit=${listingId}#package-editor`}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-100"
                    >
                      Edit package
                    </Link>
                  ) : (
                    <Link
                      href="/admin#package-editor"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-100"
                    >
                      Manage packages
                    </Link>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function ShareIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" strokeLinecap="round" />
    </svg>
  );
}
