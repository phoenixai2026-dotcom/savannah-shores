import type { Review } from "@/db/schema";

export function TripadvisorOwl({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true" fill="none">
      <path
        d="M32 5c-6.5 0-12.5 1.8-16.5 4.6H3.5l4.8 5.6C5 18.4 3 22.6 3 27c0 7.7 6.3 14 14 14 4.8 0 9-2.4 11.6-6.1L32 39.5l3.4-4.6C38 38.6 42.2 41 47 41c7.7 0 14-6.3 14-14 0-4.4-2-8.6-5.3-11.8l4.8-5.6h-12C44.5 6.8 38.5 5 32 5z"
        fill="currentColor"
      />
      <circle cx="17" cy="27" r="9.5" fill="#fff" />
      <circle cx="47" cy="27" r="9.5" fill="#fff" />
      <circle cx="17" cy="27" r="5.2" fill="currentColor" />
      <circle cx="47" cy="27" r="5.2" fill="currentColor" />
      <circle cx="17" cy="27" r="2.2" fill="#fff" />
      <circle cx="47" cy="27" r="2.2" fill="#fff" />
    </svg>
  );
}

export function TripadvisorBubbles({
  rating,
  className = "h-4",
}: {
  rating: number;
  className?: string;
}) {
  const uid = `ta-${Math.round(rating * 10)}`;
  return (
    <svg
      viewBox="0 0 110 20"
      className={className}
      role="img"
      aria-label={`${rating.toFixed(1)} of 5 bubbles`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fraction = Math.max(0, Math.min(1, rating - i));
        const cx = 10 + i * 22;
        const clipId = `${uid}-${i}`;
        return (
          <g key={i}>
            <defs>
              <clipPath id={clipId}>
                <rect x={cx - 10} y="0" width={20 * fraction} height="20" />
              </clipPath>
            </defs>
            <circle cx={cx} cy="10" r="8.5" fill="#fff" stroke="#00aa6c" strokeWidth="2" />
            <circle cx={cx} cy="10" r="8.5" fill="#00aa6c" clipPath={`url(#${clipId})`} />
          </g>
        );
      })}
    </svg>
  );
}

export function TripadvisorBadge({
  rating,
  reviewCount,
  url,
  size = "sm",
  tone = "light",
}: {
  rating: number;
  reviewCount: number;
  url: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}) {
  const isMd = size === "md";
  const base =
    tone === "dark"
      ? "bg-white/10 text-white ring-white/20 hover:bg-white/20"
      : "bg-white text-stone-800 ring-stone-200 hover:ring-ta-dark/60";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Read reviews on Tripadvisor"
      className={`inline-flex items-center gap-2 rounded-full ring-1 transition ${base} ${
        isMd ? "px-4 py-2" : "px-2.5 py-1"
      }`}
    >
      <TripadvisorOwl className={`${isMd ? "h-6 w-6" : "h-4 w-4"} text-ta-dark`} />
      <TripadvisorBubbles rating={rating} className={isMd ? "h-4" : "h-3"} />
      <span className={`font-semibold ${isMd ? "text-sm" : "text-xs"}`}>{rating.toFixed(1)}</span>
      <span className={`${isMd ? "text-sm" : "text-xs"} opacity-70`}>
        ({reviewCount.toLocaleString()} reviews)
      </span>
    </a>
  );
}

export function TripadvisorPanel({
  name,
  rating,
  reviewCount,
  url,
  award,
  compact = false,
}: {
  name: string;
  rating: number;
  reviewCount: number;
  url: string;
  award?: string | null;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-center gap-2 bg-ta px-5 py-2.5 text-forest-900">
        <TripadvisorOwl className="h-6 w-6" />
        <span className="text-sm font-bold tracking-wide">Tripadvisor</span>
        {award ? (
          <span className="ml-auto rounded-full bg-forest-900 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ta">
            {award}
          </span>
        ) : null}
      </div>
      <div className={`px-5 ${compact ? "py-4" : "py-5"}`}>
        <div className="flex items-end gap-3">
          <span className="font-display text-4xl font-semibold leading-none text-stone-900">
            {rating.toFixed(1)}
          </span>
          <div className="pb-0.5">
            <TripadvisorBubbles rating={rating} className="h-5" />
            <p className="mt-1 text-xs text-stone-500">
              {reviewCount.toLocaleString()} traveller reviews
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-stone-600">
          <span className="font-semibold text-ta-dark">Excellent</span> · {name}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-800"
        >
          Read reviews on Tripadvisor
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 4h9v9M16 4 4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export function ReviewCard({
  review,
  listingName,
  listingHref,
}: {
  review: Review;
  listingName?: string;
  listingHref?: string;
}) {
  const initials = review.author
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-700 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">{review.author}</p>
          <p className="truncate text-xs text-stone-500">{review.authorLocation}</p>
        </div>
        <TripadvisorOwl className="ml-auto h-6 w-6 shrink-0 text-ta-dark" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <TripadvisorBubbles rating={review.rating} className="h-4" />
        <span className="text-xs text-stone-500">{review.reviewedAt}</span>
      </div>
      <h3 className="mt-2 font-semibold text-stone-900">{review.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-stone-600">{review.body}</p>
      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
        <span>Written on Tripadvisor</span>
        {listingName && listingHref ? (
          <a href={listingHref} className="font-medium text-forest-700 hover:underline">
            {listingName}
          </a>
        ) : null}
      </div>
    </article>
  );
}
