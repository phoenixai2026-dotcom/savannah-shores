import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getBookingByReference } from "@/lib/data";
import { categoryLabel, formatKes, formatUsd, site, telLink } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { isMpesaLive, normalizeKenyanPhone } from "@/lib/payments/mpesa";
import { isCardLive } from "@/lib/payments/card";
import { PaymentCheckout } from "@/components/payment-checkout";
import { TripadvisorBadge } from "@/components/tripadvisor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Secure payment" };

type Props = { params: Promise<{ reference: string }> };

export default async function PayPage({ params }: Props) {
  const { reference } = await params;
  const row = await getBookingByReference(reference);
  if (!row) notFound();
  const { booking, listing } = row;

  if (booking.status === "confirmed") redirect(`/bookings/${booking.reference}`);

  const kenyanPhone = normalizeKenyanPhone(booking.phone);
  const defaultPhone = kenyanPhone ? `0${kenyanPhone.slice(3)}` : "";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
        <li className="font-semibold text-forest-700">1. Booking details</li>
        <li>›</li>
        <li className="font-semibold text-savanna-600">2. Payment</li>
        <li>›</li>
        <li>3. Confirmation</li>
      </ol>
      <h1 className="mt-4 font-display text-4xl font-semibold text-stone-900">Choose how to pay</h1>
      <p className="mt-2 text-stone-600">
        Booking reference <span className="font-mono font-semibold text-stone-900">{booking.reference}</span> ·
        Pay with Visa / Mastercard in USD or M-Pesa in KES.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <PaymentCheckout
          reference={booking.reference}
          amountUsd={booking.amountDueUsd}
          amountKes={booking.amountDueKes}
          defaultPhone={defaultPhone}
          mpesaMode={isMpesaLive() ? "live" : "sandbox"}
          cardMode={isCardLive() ? "live" : "sandbox"}
        />

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.imageUrl} alt={listing.name} className="h-40 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                {categoryLabel[listing.category]} · {listing.durationDays} days
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-stone-900">{listing.name}</h2>
              <div className="mt-2">
                <TripadvisorBadge
                  rating={listing.tripadvisorRating}
                  reviewCount={listing.tripadvisorReviewCount}
                  url={listing.tripadvisorUrl}
                />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Traveller" value={booking.customerName} />
                <Row label="Travel date" value={formatDate(booking.travelDate)} />
                <Row label="Guests" value={String(booking.guests)} />
                <Row label="Trip total" value={`${formatUsd(booking.totalUsd)} · ${formatKes(booking.totalKes)}`} />
                <Row
                  label={booking.paymentPlan === "deposit" ? `Deposit (${site.depositPercent}%)` : "Amount due"}
                  value={`${formatUsd(booking.amountDueUsd)} · ${formatKes(booking.amountDueKes)}`}
                  strong
                />
              </dl>
              {booking.paymentPlan === "deposit" ? (
                <p className="mt-3 text-xs text-stone-500">
                  Balance of {formatUsd(booking.totalUsd - booking.amountDueUsd)} due 30 days before travel, payable
                  by card or M-Pesa.
                </p>
              ) : null}
            </div>
          </div>
          <div className="rounded-2xl bg-sand-100 p-4 text-sm text-stone-600">
            Need help? Call{" "}
            <a href={telLink} className="font-semibold text-forest-700">
              {site.phoneDisplay}
            </a>{" "}
            or{" "}
            <Link href={`/packages/${listing.slug}`} className="font-semibold text-forest-700">
              go back to the package
            </Link>
            .
          </div>
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className={`text-right ${strong ? "font-semibold text-stone-900" : "text-stone-800"}`}>{value}</dd>
    </div>
  );
}
