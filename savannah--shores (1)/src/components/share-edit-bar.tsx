"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";

export function ShareEditBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [fullUrl, setFullUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, [pathname]);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText && fullUrl) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  }

  return (
    <div className="border-b border-savanna-500/30 bg-sand-100 text-stone-900 shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-savanna-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Share Link
          </span>
          <input
            readOnly
            aria-label="Current page shareable link"
            value={fullUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 truncate rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-mono text-xs text-stone-800 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 cursor-pointer rounded-lg bg-forest-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-forest-800"
          >
            {copied ? "✓ Link Copied!" : "Copy Share Link"}
          </button>
          <a
            href={whatsappLink(
              `Explore ${site.name}: ${fullUrl}`,
              "web",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-1 rounded-lg bg-mpesa px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-mpesa-dark sm:inline-flex"
          >
            WhatsApp Link
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin#package-editor")}
            className="cursor-pointer rounded-lg border border-savanna-500 bg-savanna-500/10 px-3.5 py-1.5 text-xs font-bold text-savanna-700 transition hover:bg-savanna-500 hover:text-white"
          >
            ✎ Edit Packages & Prices
          </button>
        </div>
      </div>
    </div>
  );
}
