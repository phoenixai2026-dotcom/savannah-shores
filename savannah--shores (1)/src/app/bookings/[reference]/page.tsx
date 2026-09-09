import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingByReference, getPaymentsForBooking } from "@/lib/data";
import { categoryLabel, formatKes, formatUsd, site, telLink } from "@/lib/site";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { formatKenyanPhone } from "@/lib/payments/mpesa";
import { TripadvisorBadge, TripadvisorOwl } from "@/components/tripadvisor";
import { MastercardLogo, MpesaLogo, VisaLogo } from "@/components/payment-logos";
import { PhoneIcon } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Booking confirmation" };

type Props = { params: Promise<{ reference: string }> };

export default async function BookingPage({ params }: Props) {
  const { reference } = await params;
  const row = await getBookingByReference(reference);
  if (!row) notFound();
  const { booking, listing } = row;
  const paymentList = await getPaymentsForBooking(booking.id);
  const paid = paymentList.find((p) => p.status === "paid") ?? null;
  const confirmed = booking.status === "confirmed";

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className={`rounded-3xl p-8 text-white ${confirmed ? "bg-forest-900" : "bg-savanna-600"} texture-dots`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              {confirmed ? "Booking confirmed" : "Awaiting payment"}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold">
              {confirmed ? `Asante sana, ${booking.customerName.split(" ")[0]}!` : "Almost there"}
            </h1>
            <p className="mt-2 max-w-xl text-white/80">
              {confirmed
                ? `Your ${categoryLabel[listing.category].toLowerCase()} is booked. A confirmation email is on its way to ${booking.email}.`
                : "Complete your payment to secure your dates. Your booking is held for 24 hours."}
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3 text-right ring-1 ring-white/20">
            <p className="text-xs uppercase tracking-wide text-white/70">Reference</p>
            <p className="font-mono text-2xl font-bold">{booking.reference}</p>
          </div>
        </div>
        {!confirmed ? (
          <Link href={`/pay/${booking.reference}`} className="btn-secondary mt-6">
            Pay now with Visa or M-Pesa
          </Link>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-2xl font-semibold text-stone-900">Trip details</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.imageUrl} alt={listing.name} className="mt-4 h-40 w-full rounded-2xl object-cover" />
          <Link href={`/packages/${listing.slug}`} className="mt-4 block font-display text-xl font-semibold text-stone-900 hover:text-savanna-600">
            {listing.name}
          </Link>
          <p className="text-sm text-stone-500">{listing.location} · {listing.durationDays} days</p>
          <div className="mt-2">
            <TripadvisorBadge rating={listing.tripadvisorRating} reviewCount={listing.tripadvisorReviewCount} url={listing.tripadvisorUrl} />
          </div>
          <dl className="mt-5 space-y-2 text-sm">
            <Row label="Traveller" value={booking.customerName} />
            <Row label="Email" value={booking.email} />
            <Row label="Phone" value={booking.phone} />
            <Row label="Travel date" value={formatDate(booking.travelDate)} />
            <Row label="Guests" value={String(booking.guests)} />
            {booking.notes ? <Row label="Requests" value={booking.notes} /> : null}
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-stone-900">Payment</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Trip total" value={`${formatUsd(booking.totalUsd)} · ${formatKes(booking.totalKes)}`} />
              <Row label={booking.paymentPlan === "deposit" ? `Deposit (${site.depositPercent}%)` : "Amount due"} value={`${formatUsd(booking.amountDueUsd)} · ${formatKes(booking.amountDueKes)}`} strong />
              {booking.paymentPlan === "deposit" ? (
                <Row label="Balance (30 days before travel)" value={formatUsd(booking.totalUsd - booking.amountDueUsd)} />
              ) : null}
            </dl>
            {paid ? (
              <div className="mt-5 rounded-2xl border border-mpesa/40 bg-mpesa/10 p-4">
                <div className="flex items-center gap-3">
                  {paid.method === "mpesa" ? <MpesaLogo className="h-8" /> : paid.cardBrand === "mastercard" ? <MastercardLogo className="h-8" /> : <VisaLogo className="h-8" />}
                  <div>
                    <p className="font-semibold text-stone-900">
                      Paid {paid.currency === "KES" ? formatKes(paid.amount) : formatUsd(paid.amount)}
                      {paid.method === "mpesa" ? " via M-Pesa" : ` with ${paid.cardBrand === "mastercard" ? "Mastercard" : "Visa"} •••• ${paid.cardLast4}`}
                    </p>
                    <p className="text-xs text-stone-600">
                      {paid.method === "mpesa" ? "M-Pesa receipt" : "Authorisation code"}{" "}
                      <span className="font-mono font-semibold">{paid.providerRef}</span>
                      {paid.mpesaPhone ? ` · ${formatKenyanPhone(paid.mpesaPhone)}` : ""} · {formatDateTime(paid.updatedAt)}
                    </p>
                  </div>
                </div>
                {paid.mode === "sandbox" ? (
                  <p className="mt-2 text-[11px] text-stone-500">Sandbox transaction – no funds were moved.</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 text-sm text-stone-600">
                <span className="mr-1">Pay with</span>
                <VisaLogo className="h-7" />
                <MastercardLogo className="h-7" />
                <MpesaLogo className="h-7" />
              </div>
            )}
            {paymentList.filter((p) => p.status !== "paid").length > 0 ? (
              <details className="mt-4 text-xs text-stone-500">
                <summary className="cursor-pointer">Payment attempts ({paymentList.length})</summary>
                <ul className="mt-2 space-y-1">
                  {paymentList.map((p) => (
                    <li key={p.id}>
                      {formatDateTime(p.createdAt)} · {p.method === "mpesa" ? "M-Pesa" : "Card"} · {p.status}
                      {p.failureReason ? ` – ${p.failureReason}` : ""}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-stone-900">We're here to help</h2>
            <a href={telLink} className="mt-3 flex items-center gap-2 text-lg font-semibold text-forest-700">
              <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
            </a>
            <WhatsAppLink
              message={`Hello, I have a question about booking ${booking.reference}.`}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-mpesa-dark hover:underline"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp about this booking
            </WhatsAppLink>
            <p className="mt-2 text-sm text-stone-500">{site.email}</p>
          </div>

          {confirmed ? (
            <a
              href={listing.tripadvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-3xl bg-ta p-5 text-forest-900 transition hover:brightness-105"
            >
              <TripadvisorOwl className="h-9 w-9" />
              <span>
                <span className="block font-semibold">Enjoyed booking with us?</span>
                <span className="text-sm">Share your experience on Tripadvisor after your trip.</span>
              </span>
            </a>
          ) : null}
        </div>
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
