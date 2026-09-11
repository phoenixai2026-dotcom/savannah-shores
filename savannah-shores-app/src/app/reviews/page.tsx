import type { Metadata } from "next";
import { getAllReviews, getListings } from "@/lib/data";
import { site } from "@/lib/site";
import { ReviewCard, TripadvisorBadge, TripadvisorBubbles, TripadvisorOwl, TripadvisorPanel } from "@/components/tripadvisor";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tripadvisor Reviews",
  description: "Read what travellers say on Tripadvisor about our Kenya safaris and beach holidays.",
};

export default async function ReviewsPage() {
  const [all, listingRows] = await Promise.all([getAllReviews(), getListings()]);
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: all.filter((r) => r.review.rating === star).length,
  }));

  return (
    <>
      <section className="bg-forest-900 text-white texture-dots">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-ta">
            <TripadvisorOwl className="h-5 w-5" /> Tripadvisor
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold">Traveller reviews</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Every safari and beach holiday we run is reviewed independently on Tripadvisor. Here is a
            selection – follow the links to read them all.
          </p>
          <div className="mt-6">
            <TripadvisorBadge rating={site.tripadvisorRating} reviewCount={site.tripadvisorReviewCount} url={site.tripadvisorUrl} size="md" tone="dark" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <TripadvisorPanel
              name={site.name}
              rating={site.tripadvisorRating}
              reviewCount={site.tripadvisorReviewCount}
              url={site.tripadvisorUrl}
              award={site.tripadvisorAward}
            />
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Rating breakdown (shown here)</p>
              <ul className="mt-3 space-y-2">
                {counts.map(({ star, count }) => (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-14 text-stone-600">{star} bubble{star > 1 ? "s" : ""}</span>
                    <div className="h-2 flex-1 rounded-full bg-stone-100">
                      <div className="h-2 rounded-full bg-ta-dark" style={{ width: `${all.length ? (count / all.length) * 100 : 0}%` }} />
                    </div>
                    <span className="w-6 text-right text-stone-500">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Ratings by package</p>
              <ul className="mt-3 space-y-2.5">
                {listingRows.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={`/packages/${l.slug}`} className="truncate text-stone-700 hover:text-savanna-600">
                      {l.name}
                    </Link>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <TripadvisorBubbles rating={l.tripadvisorRating} className="h-3" />
                      <span className="font-semibold">{l.tripadvisorRating.toFixed(1)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="grid gap-5 md:grid-cols-2">
            {all.map(({ review, listing }) => (
              <ReviewCard key={review.id} review={review} listingName={listing.name} listingHref={`/packages/${listing.slug}`} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
