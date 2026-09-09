import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { getListings, getRecentBookings, getRecentPayments } from "@/lib/data";
import { formatKes, formatUsd } from "@/lib/site";
import { formatDate, formatDateTime } from "@/lib/utils";
import { desc } from "drizzle-orm";
import { MastercardLogo, MpesaLogo, VisaLogo } from "@/components/payment-logos";
import { PackageEditorSection } from "@/components/package-editor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Bookings dashboard" };

const statusStyles: Record<string, string> = {
  confirmed: "bg-mpesa/15 text-mpesa-dark",
  pending_payment: "bg-amber-100 text-amber-800",
  cancelled: "bg-stone-200 text-stone-600",
  paid: "bg-mpesa/15 text-mpesa-dark",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-700",
};

export default async function AdminPage() {
  const [bookingRows, paymentRows, inquiryRows, allListings] = await Promise.all([
    getRecentBookings(),
    getRecentPayments(),
    db.select().from(inquiries).orderBy(desc(inquiries.id)).limit(50),
    getListings(),
  ]);

  const paidPayments = paymentRows.filter((p) => p.payment.status === "paid");
  const revenueUsd = paidPayments.reduce((sum, p) => sum + (p.payment.currency === "USD" ? p.payment.amount : 0), 0);
  const revenueKes = paidPayments.reduce((sum, p) => sum + (p.payment.currency === "KES" ? p.payment.amount : 0), 0);
  const cardCount = paidPayments.filter((p) => p.payment.method === "visa").length;
  const mpesaCount = paidPayments.filter((p) => p.payment.method === "mpesa").length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-600">Operations</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-stone-900">Bookings & payments</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bookings" value={String(bookingRows.length)} />
        <Stat label="Confirmed" value={String(bookingRows.filter((b) => b.booking.status === "confirmed").length)} />
        <Stat label="Card revenue (Visa / MC)" value={formatUsd(revenueUsd)} hint={`${cardCount} payments`} />
        <Stat label="M-Pesa revenue" value={formatKes(revenueKes)} hint={`${mpesaCount} payments`} />
      </div>

      <Suspense fallback={<div className="mt-12 text-stone-500">Loading editor…</div>}>
        <PackageEditorSection initialListings={allListings} />
      </Suspense>

      <h2 className="mt-12 font-display text-2xl font-semibold text-stone-900">Recent bookings</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Traveller</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Travel date</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookingRows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-stone-500">No bookings yet.</td></tr>
            ) : bookingRows.map(({ booking, listing }) => (
              <tr key={booking.id}>
                <td className="px-4 py-3 font-mono font-semibold">
                  <Link href={`/bookings/${booking.reference}`} className="text-forest-700 hover:underline">{booking.reference}</Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{booking.customerName}</p>
                  <p className="text-xs text-stone-500">{booking.email} · {booking.phone}</p>
                </td>
                <td className="px-4 py-3">{listing.name}</td>
                <td className="px-4 py-3">{formatDate(booking.travelDate)}</td>
                <td className="px-4 py-3">{booking.guests}</td>
                <td className="px-4 py-3">
                  {formatUsd(booking.amountDueUsd)}
                  <span className="block text-xs text-stone-500">{booking.paymentPlan === "deposit" ? "deposit" : "full"}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-stone-900">Payments</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paymentRows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-stone-500">No payments yet.</td></tr>
            ) : paymentRows.map(({ payment, booking }) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 text-stone-600">{formatDateTime(payment.createdAt)}</td>
                <td className="px-4 py-3 font-mono">{booking.reference}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    {payment.method === "mpesa" ? <MpesaLogo className="h-6" /> : payment.cardBrand === "mastercard" ? <MastercardLogo className="h-6" /> : <VisaLogo className="h-6" />}
                    <span className="text-xs text-stone-500">
                      {payment.method === "mpesa" ? payment.mpesaPhone : payment.cardLast4 ? `•••• ${payment.cardLast4}` : "card"}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{payment.currency === "KES" ? formatKes(payment.amount) : formatUsd(payment.amount)}</td>
                <td className="px-4 py-3 font-mono text-xs">{payment.providerRef ?? payment.checkoutRequestId ?? "—"}</td>
                <td className="px-4 py-3 text-xs uppercase text-stone-500">{payment.mode}</td>
                <td className="px-4 py-3">
                  <Badge status={payment.status} />
                  {payment.failureReason ? <p className="mt-1 max-w-[200px] text-xs text-stone-500">{payment.failureReason}</p> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-stone-900">Enquiries</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {inquiryRows.length === 0 ? (
          <p className="text-stone-500">No enquiries yet.</p>
        ) : inquiryRows.map((q) => (
          <div key={q.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-stone-900">{q.name}</p>
                <p className="text-xs text-stone-500">{q.email}{q.phone ? ` · ${q.phone}` : ""}</p>
              </div>
              <span className="rounded-full bg-sand-100 px-2.5 py-1 text-xs font-medium text-stone-600">{q.subject}</span>
            </div>
            <p className="mt-3 text-sm text-stone-700">{q.message}</p>
            <p className="mt-2 text-xs text-stone-400">{formatDateTime(q.createdAt)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-stone-900">{value}</p>
      {hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status] ?? "bg-stone-100 text-stone-600"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
