import Link from "next/link";
import type { Listing } from "@/db/schema";
import { categoryLabel, formatKes, formatUsd, usdToKes } from "@/lib/site";
import { TripadvisorBadge } from "@/components/tripadvisor";
import { MastercardLogo, MpesaLogo, VisaLogo } from "@/components/payment-logos";
import { ShareLinkButton } from "@/components/share-link";
import { InlineEditButton } from "@/components/inline-edit-button";

export function ListingCard({ listing }: { listing: Listing }) {
  const href = `/packages/${listing.slug}`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
              listing.category === "safari" ? "bg-savanna-500" : "bg-ocean-500"
            }`}
          >
            {categoryLabel[listing.category]}
          </span>
          {listing.tripadvisorAward ? (
            <span className="rounded-full bg-forest-900/90 px-3 py-1 text-[11px] font-semibold text-ta">
              {listing.tripadvisorAward}
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-white">
          <p className="text-xs font-medium text-white/80">{listing.location}</p>
          <p className="text-sm font-semibold">{listing.durationDays} days</p>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <TripadvisorBadge
          rating={listing.tripadvisorRating}
          reviewCount={listing.tripadvisorReviewCount}
          url={listing.tripadvisorUrl}
        />
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-stone-900">
          <Link href={href} className="hover:text-savanna-600">
            {listing.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-stone-600">{listing.tagline}</p>
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">From, per person</p>
              <p className="font-display text-2xl font-semibold text-stone-900">
                {formatUsd(listing.priceUsd)}
              </p>
              <p className="text-xs text-stone-500">≈ {formatKes(usdToKes(listing.priceUsd))}</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <InlineEditButton listing={listing} />
              <ShareLinkButton
                title={listing.name}
                path={href}
                listingId={listing.id}
                compact
                label="Share"
              />
              <Link href={href} className="btn-primary !px-4 !py-2 !text-sm">
                Book now
              </Link>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 border-t border-stone-100 pt-3">
            <span className="mr-1 text-[11px] uppercase tracking-wide text-stone-400">Pay with</span>
            <VisaLogo className="h-6" />
            <MastercardLogo className="h-6" />
            <MpesaLogo className="h-6" />
          </div>
        </div>
      </div>
    </article>
  );
}
