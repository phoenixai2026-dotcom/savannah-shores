import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingBySlug, getListings, getReviewsForListing } from "@/lib/data";
import { categoryLabel, categoryPath, site, telLink } from "@/lib/site";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { BookingForm } from "@/components/booking-form";
import { ListingCard } from "@/components/listing-card";
import { ReviewCard, TripadvisorBadge, TripadvisorPanel } from "@/components/tripadvisor";
import { PaymentMethodsStrip } from "@/components/payment-logos";
import { PhoneIcon } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/site-footer";
import { ShareLinkButton } from "@/components/share-link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Package not found" };
  return {
    title: listing.name,
    description: `${listing.tagline} Rated ${listing.tripadvisorRating.toFixed(1)} on Tripadvisor. Pay with Visa, Mastercard or M-Pesa.`,
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const [reviews, siblings] = await Promise.all([
    getReviewsForListing(listing.id),
    getListings(listing.category),
  ]);
  const related = siblings.filter((l) => l.id !== listing.id).slice(0, 3);

  return (
    <>
      <section className="relative isolate bg-forest-900 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={listing.imageUrl} alt={listing.name} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/60 to-forest-900/20" />
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pt-40">
          <nav className="text-sm text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href={categoryPath[listing.category]} className="hover:text-white">
              {listing.category === "safari" ? "Safaris" : "Beach Holidays"}
            </Link>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${listing.category === "safari" ? "bg-savanna-500" : "bg-ocean-500"}`}>
              {categoryLabel[listing.category]}
            </span>
            <TripadvisorBadge
              rating={listing.tripadvisorRating}
              reviewCount={listing.tripadvisorReviewCount}
              url={listing.tripadvisorUrl}
              size="md"
              tone="dark"
            />
            {listing.tripadvisorAward ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-ta ring-1 ring-white/20">
                Tripadvisor {listing.tripadvisorAward}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {listing.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">{listing.tagline}</p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/80">
            <span>📍 {listing.location}</span>
            <span>🗓 {listing.durationDays} days / {listing.durationDays - 1} nights</span>
            <span>👥 Private departures, any day</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ShareLinkButton
              title={listing.name}
              path={`/packages/${listing.slug}`}
              listingId={listing.id}
              label="Share package link"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
            />
            <Link
              href={`/admin?edit=${listing.id}#package-editor`}
              className="inline-flex items-center gap-2 rounded-full bg-savanna-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-savanna-500"
            >
              Edit package details
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-3">
              {listing.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${listing.name} photo ${i + 1}`}
                  className={`h-40 w-full rounded-2xl object-cover sm:h-56 ${i === 0 ? "col-span-3 sm:col-span-1" : ""}`}
                  loading="lazy"
                />
              ))}
            </div>

            <h2 className="mt-10 font-display text-3xl font-semibold text-stone-900">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-700">{listing.description}</p>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl font-semibold text-stone-900">Highlights</h3>
                <ul className="mt-4 space-y-2.5">
                  {listing.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-stone-700">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-savanna-500/15 text-savanna-600">
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-stone-900">What's included</h3>
                <ul className="mt-4 space-y-2.5">
                  {listing.includes.map((h) => (
                    <li key={h} className="flex gap-3 text-stone-700">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-display text-2xl font-semibold text-stone-900">Payment options</h3>
              <p className="mt-2 text-stone-600">
                Pay in full or secure this {categoryLabel[listing.category].toLowerCase()} with a {site.depositPercent}% deposit.
                Visa and Mastercard are charged in USD; M-Pesa payments are made in KES at{" "}
                {site.usdToKes} KES/USD.
              </p>
              <PaymentMethodsStrip className="mt-4" size="h-10" />
            </div>

            <div className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-semibold text-stone-900">Tripadvisor reviews</h2>
                <a href={listing.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-ta-dark hover:underline">
                  See all {listing.tripadvisorReviewCount.toLocaleString()} reviews on Tripadvisor →
                </a>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <BookingForm listingId={listing.id} listingName={listing.name} priceUsd={listing.priceUsd} />
            <TripadvisorPanel
              name={listing.name}
              rating={listing.tripadvisorRating}
              reviewCount={listing.tripadvisorReviewCount}
              url={listing.tripadvisorUrl}
              award={listing.tripadvisorAward}
              compact
            />
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Prefer to book by phone?</p>
              <a href={telLink} className="mt-2 flex items-center gap-2 text-lg font-semibold text-forest-700">
                <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
              </a>
              <WhatsAppLink
                message={`Hello, I'm interested in the ${listing.name}.`}
                className="mt-2 flex items-center gap-2 text-sm font-medium text-mpesa-dark hover:underline"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp us about this trip
              </WhatsAppLink>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-sand-100 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              More {listing.category === "safari" ? "safaris" : "beach holidays"}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
