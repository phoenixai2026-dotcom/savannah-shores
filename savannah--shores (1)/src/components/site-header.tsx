"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site, telLink } from "@/lib/site";
import { TripadvisorOwl, TripadvisorBubbles } from "@/components/tripadvisor";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/safaris", label: "Safaris" },
  { href: "/beach", label: "Beach Holidays" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/admin#package-editor", label: "Share & Edit" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-forest-800/40 bg-forest-900/95 text-white backdrop-blur">
      <div className="hidden border-b border-white/10 bg-forest-800/60 text-xs sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <a href={telLink} className="flex items-center gap-1.5 hover:text-ta">
              <PhoneIcon className="h-3.5 w-3.5" />
              <span className="font-semibold">{site.phoneDisplay}</span>
            </a>
            <span className="text-white/60">{site.hours}</span>
          </div>
          <a
            href={site.tripadvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-ta"
          >
            <TripadvisorOwl className="h-4 w-4 text-ta" />
            <TripadvisorBubbles rating={site.tripadvisorRating} className="h-3" />
            <span>
              <span className="font-semibold">{site.tripadvisorRating.toFixed(1)}</span> on Tripadvisor ·{" "}
              {site.tripadvisorReviewCount.toLocaleString()} reviews
            </span>
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-savanna-500 font-display text-lg font-bold text-white shadow-lg shadow-savanna-500/40">
            S
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-tight">
              {site.shortName}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-white/60">
              Kenya Safaris & Beaches
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telLink}
            className="hidden items-center gap-2 rounded-full bg-savanna-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-savanna-500/30 transition hover:bg-savanna-600 md:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phoneDisplay}
          </a>
          <a
            href={telLink}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-savanna-500 text-white md:hidden"
            aria-label={`Call ${site.phoneDisplay}`}
          >
            <PhoneIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-forest-900 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  isActive(item.href) ? "bg-white/15" : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3 text-sm">
              <a href={telLink} className="flex items-center gap-2 px-4 py-2 font-semibold">
                <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
              </a>
              <a
                href={site.tripadvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2"
              >
                <TripadvisorOwl className="h-4 w-4 text-ta" />
                <TripadvisorBubbles rating={site.tripadvisorRating} className="h-3" />
                <span>{site.tripadvisorRating.toFixed(1)} on Tripadvisor</span>
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
