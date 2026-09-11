import { getListings } from "@/lib/data";
import { site, telLink } from "@/lib/site";
import { ListingCard } from "@/components/listing-card";
import { TripadvisorBadge } from "@/components/tripadvisor";
import { PaymentMethodsStrip } from "@/components/payment-logos";

export async function CategoryPage({
  category,
  title,
  eyebrow,
  intro,
  image,
}: {
  category: "safari" | "beach";
  title: string;
  eyebrow: string;
  intro: string;
  image: string;
}) {
  const items = await getListings(category);
  const avgRating =
    items.length > 0
      ? items.reduce((sum, l) => sum + l.tripadvisorRating, 0) / items.length
      : site.tripadvisorRating;
  const totalReviews = items.reduce((sum, l) => sum + l.tripadvisorReviewCount, 0);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/90 via-forest-900/60 to-forest-900/30" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-400">{eyebrow}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <TripadvisorBadge
              rating={Math.round(avgRating * 10) / 10}
              reviewCount={totalReviews}
              url={site.tripadvisorUrl}
              size="md"
              tone="dark"
            />
            <PaymentMethodsStrip label="Pay with" size="h-8" tone="dark" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-stone-600">
            {items.length} {category === "safari" ? "safari" : "beach"} packages · all rated on Tripadvisor
          </p>
          <p className="text-sm text-stone-600">
            Questions? Call{" "}
            <a href={telLink} className="font-semibold text-forest-700">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </>
  );
}
