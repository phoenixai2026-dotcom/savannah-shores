import Link from "next/link";
import { site, telLink } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-600">404</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-stone-900">We couldn't find that page</h1>
      <p className="mt-4 text-stone-600">
        The safari or booking you're looking for may have moved. Call us on{" "}
        <a href={telLink} className="font-semibold text-forest-700">{site.phoneDisplay}</a> and we'll help.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/safaris" className="btn-primary">Browse safaris</Link>
        <Link href="/beach" className="btn-secondary">Beach holidays</Link>
      </div>
    </section>
  );
}
