"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKes, formatUsd, site, usdToKes } from "@/lib/site";
import { MastercardLogo, MpesaLogo, VisaLogo } from "@/components/payment-logos";

export function BookingForm({
  listingId,
  listingName,
  priceUsd,
}: {
  listingId: number;
  listingName: string;
  priceUsd: number;
}) {
  const router = useRouter();
  const [guests, setGuests] = useState(2);
  const [paymentPlan, setPaymentPlan] = useState<"full" | "deposit">("full");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  }, []);

  const totalUsd = priceUsd * guests;
  const dueUsd = paymentPlan === "full" ? totalUsd : Math.ceil((totalUsd * site.depositPercent) / 100);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      listingId,
      customerName: String(form.get("customerName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      travelDate: String(form.get("travelDate") ?? ""),
      guests,
      paymentPlan,
      notes: String(form.get("notes") ?? ""),
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { reference?: string; error?: string };
      if (!res.ok || !data.reference) {
        throw new Error(data.error ?? "We could not create your booking. Please try again.");
      }
      router.push(`/pay/${data.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500">From, per person</p>
          <p className="font-display text-3xl font-semibold text-stone-900">{formatUsd(priceUsd)}</p>
          <p className="text-xs text-stone-500">≈ {formatKes(usdToKes(priceUsd))}</p>
        </div>
        <div className="flex items-center gap-1">
          <VisaLogo className="h-6" />
          <MastercardLogo className="h-6" />
          <MpesaLogo className="h-6" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="label" htmlFor="customerName">Full name</label>
          <input id="customerName" name="customerName" required className="input" placeholder="Jane Wanjiku" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" placeholder="jane@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone / WhatsApp</label>
            <input id="phone" name="phone" type="tel" required className="input" placeholder="+254 7XX XXX XXX" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="travelDate">Travel date</label>
            <input id="travelDate" name="travelDate" type="date" required min={minDate} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="guests">Guests</label>
            <div className="flex items-center rounded-xl border border-stone-300">
              <button
                type="button"
                className="h-12 w-12 text-xl text-stone-600 hover:bg-stone-50"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                aria-label="Fewer guests"
              >
                −
              </button>
              <input
                id="guests"
                readOnly
                value={guests}
                className="w-full border-0 bg-transparent text-center text-base font-semibold focus:outline-none"
              />
              <button
                type="button"
                className="h-12 w-12 text-xl text-stone-600 hover:bg-stone-50"
                onClick={() => setGuests((g) => Math.min(12, g + 1))}
                aria-label="More guests"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="label">Payment plan</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["full", "Pay in full", "Confirm everything today"],
                ["deposit", `${site.depositPercent}% deposit`, "Balance due 30 days before travel"],
              ] as const
            ).map(([value, title, text]) => (
              <label
                key={value}
                className={`flex cursor-pointer flex-col rounded-xl border p-3 transition ${
                  paymentPlan === value
                    ? "border-savanna-500 bg-savanna-500/5 ring-2 ring-savanna-500/30"
                    : "border-stone-300 hover:border-stone-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentPlan"
                    value={value}
                    checked={paymentPlan === value}
                    onChange={() => setPaymentPlan(value)}
                    className="accent-savanna-600"
                  />
                  <span className="font-semibold text-stone-900">{title}</span>
                </span>
                <span className="ml-6 text-xs text-stone-500">{text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="notes">Special requests (optional)</label>
          <textarea id="notes" name="notes" rows={2} className="input" placeholder="Dietary needs, room preferences, celebrations…" />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-sand-100 p-4 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>{listingName}</span>
          <span>{guests} × {formatUsd(priceUsd)}</span>
        </div>
        <div className="mt-1 flex justify-between text-stone-600">
          <span>Trip total</span>
          <span>{formatUsd(totalUsd)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-stone-300 pt-2 text-base font-semibold text-stone-900">
          <span>{paymentPlan === "full" ? "Due now" : `Deposit due now (${site.depositPercent}%)`}</span>
          <span>
            {formatUsd(dueUsd)} <span className="text-xs font-normal text-stone-500">/ {formatKes(usdToKes(dueUsd))}</span>
          </span>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">
        {submitting ? "Creating booking…" : "Continue to payment"}
      </button>
      <p className="mt-3 text-center text-xs text-stone-500">
        Next step: choose Visa / Mastercard or M-Pesa. No charge until you confirm.
      </p>
    </form>
  );
}
