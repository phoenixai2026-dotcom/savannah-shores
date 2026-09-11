"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKes, formatUsd, site } from "@/lib/site";
import { MastercardLogo, MpesaLogo, VisaLogo } from "@/components/payment-logos";

type Method = "visa" | "mpesa";

type StatusResponse = {
  status: "pending" | "paid" | "failed" | "cancelled";
  receipt: string | null;
  failureReason: string | null;
  reference: string | null;
};

export function PaymentCheckout({
  reference,
  amountUsd,
  amountKes,
  defaultPhone,
  mpesaMode,
  cardMode,
}: {
  reference: string;
  amountUsd: number;
  amountKes: number;
  defaultPhone: string;
  mpesaMode: "live" | "sandbox";
  cardMode: "live" | "sandbox";
}) {
  const [method, setMethod] = useState<Method>("visa");

  return (
    <div className="rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/60">
      <div className="grid grid-cols-2 gap-2 p-2">
        <MethodTab active={method === "visa"} onClick={() => setMethod("visa")} title="Visa / Mastercard" subtitle={`Pay ${formatUsd(amountUsd)}`}>
          <VisaLogo className="h-7" />
          <MastercardLogo className="h-7" />
        </MethodTab>
        <MethodTab active={method === "mpesa"} onClick={() => setMethod("mpesa")} title="M-Pesa" subtitle={`Pay ${formatKes(amountKes)}`}>
          <MpesaLogo className="h-7" />
        </MethodTab>
      </div>
      <div className="border-t border-stone-200 p-6">
        {method === "visa" ? (
          <CardForm reference={reference} amountUsd={amountUsd} mode={cardMode} />
        ) : (
          <MpesaForm reference={reference} amountKes={amountKes} defaultPhone={defaultPhone} mode={mpesaMode} />
        )}
      </div>
    </div>
  );
}

function MethodTab({
  active,
  onClick,
  title,
  subtitle,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-savanna-500 bg-savanna-500/5 ring-2 ring-savanna-500/30"
          : "border-stone-200 hover:border-stone-300"
      }`}
    >
      <span className="flex items-center gap-1.5">{children}</span>
      <span>
        <span className="block text-sm font-semibold text-stone-900">{title}</span>
        <span className="block text-xs text-stone-500">{subtitle}</span>
      </span>
    </button>
  );
}

function SandboxNote({ mode, text }: { mode: "live" | "sandbox"; text: string }) {
  if (mode === "live") return null;
  return (
    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <span className="font-semibold">Sandbox mode:</span> {text}
    </p>
  );
}

/* ----------------------------- Card (Visa) ------------------------------ */

function detectBrand(number: string) {
  const d = number.replace(/\D/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  return null;
}

function CardForm({ reference, amountUsd, mode }: { reference: string; amountUsd: number; mode: "live" | "sandbox" }) {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const brand = detectBrand(number);

  function onNumberChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    setNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  }

  function onExpiryChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const [expMonth, expYear] = expiry.split("/");
    try {
      const res = await fetch("/api/payments/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          name: form.get("cardName"),
          number,
          expMonth,
          expYear,
          cvv: form.get("cvv"),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Payment was declined.");
      router.push(`/bookings/${reference}?paid=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="cardName">Name on card</label>
        <input id="cardName" name="cardName" required className="input" placeholder="JANE WANJIKU" autoComplete="cc-name" />
      </div>
      <div>
        <label className="label" htmlFor="cardNumber">Card number</label>
        <div className="relative">
          <input
            id="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            required
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            className="input pr-24 font-mono tracking-wider"
            placeholder="4242 4242 4242 4242"
          />
          <span className="absolute inset-y-0 right-2 flex items-center gap-1">
            <VisaLogo className={`h-6 transition ${brand === "mastercard" ? "opacity-30" : ""}`} />
            <MastercardLogo className={`h-6 transition ${brand === "visa" ? "opacity-30" : ""}`} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="expiry">Expiry (MM/YY)</label>
          <input
            id="expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            required
            value={expiry}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="input font-mono"
            placeholder="09/28"
          />
        </div>
        <div>
          <label className="label" htmlFor="cvv">CVV</label>
          <input id="cvv" name="cvv" inputMode="numeric" autoComplete="cc-csc" required maxLength={4} className="input font-mono" placeholder="123" />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Authorising…" : `Pay ${formatUsd(amountUsd)} securely`}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
        <LockIcon className="h-3.5 w-3.5" /> 256-bit encrypted · Card details are never stored
      </p>
      <SandboxNote mode={mode} text="No real charge is made. Use test card 4242 4242 4242 4242 with any future expiry and CVV." />
    </form>
  );
}

/* ------------------------------- M-Pesa --------------------------------- */

type MpesaStage = "idle" | "sending" | "waiting" | "paid" | "failed";

function MpesaForm({
  reference,
  amountKes,
  defaultPhone,
  mode,
}: {
  reference: string;
  amountKes: number;
  defaultPhone: string;
  mode: "live" | "sandbox";
}) {
  const router = useRouter();
  const [phone, setPhone] = useState(defaultPhone);
  const [stage, setStage] = useState<MpesaStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [sentTo, setSentTo] = useState<string>("");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (stage !== "waiting" || !paymentId) return;
    const startedAt = Date.now();
    const poll = async () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
      try {
        const res = await fetch(`/api/payments/${paymentId}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as StatusResponse;
        if (data.status === "paid") {
          setReceipt(data.receipt);
          setStage("paid");
          setTimeout(() => router.push(`/bookings/${reference}?paid=1`), 1800);
        } else if (data.status === "failed" || data.status === "cancelled") {
          setError(data.failureReason ?? "The M-Pesa request was not completed.");
          setStage("failed");
        } else if (Date.now() - startedAt > 120000) {
          setError("We did not receive a confirmation from M-Pesa in time. Please try again.");
          setStage("failed");
        }
      } catch {
        /* transient network error – keep polling */
      }
    };
    timerRef.current = setInterval(poll, 2000);
    void poll();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, paymentId, reference, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStage("sending");
    try {
      const res = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const data = (await res.json()) as { ok?: boolean; paymentId?: number; phone?: string; error?: string };
      if (!res.ok || !data.ok || !data.paymentId) throw new Error(data.error ?? "M-Pesa request failed.");
      setPaymentId(data.paymentId);
      setSentTo(data.phone ?? phone);
      setStage("waiting");
    } catch (err) {
      setError(err instanceof Error ? err.message : "M-Pesa request failed.");
      setStage("failed");
    }
  }

  if (stage === "waiting" || stage === "paid") {
    return (
      <div className="text-center">
        <div className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full ${stage === "paid" ? "bg-mpesa text-white" : "pulse-ring bg-mpesa/10 text-mpesa"}`}>
          {stage === "paid" ? (
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <PhoneVibrateIcon className="h-9 w-9" />
          )}
        </div>
        {stage === "paid" ? (
          <>
            <h3 className="mt-5 font-display text-2xl font-semibold text-stone-900">Payment received</h3>
            <p className="mt-2 text-stone-600">
              M-Pesa receipt <span className="font-mono font-semibold text-stone-900">{receipt}</span>
            </p>
            <p className="mt-1 text-sm text-stone-500">Taking you to your confirmation…</p>
          </>
        ) : (
          <>
            <h3 className="mt-5 font-display text-2xl font-semibold text-stone-900">Check your phone</h3>
            <p className="mt-2 text-stone-600">
              We sent an M-Pesa prompt for <span className="font-semibold text-stone-900">{formatKes(amountKes)}</span> to{" "}
              <span className="font-semibold text-stone-900">{sentTo}</span>. Enter your M-Pesa PIN to complete
              the payment.
            </p>
            <p className="mt-4 text-xs text-stone-500">Waiting for confirmation… {elapsed}s</p>
            <SandboxNote mode={mode} text="The prompt is simulated and will auto-confirm in a few seconds." />
            <button type="button" className="btn-secondary mt-5 !py-2 !text-sm" onClick={() => setStage("idle")}>
              Use a different number
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-2xl bg-mpesa/10 p-4 text-sm text-stone-700">
        <p className="font-semibold text-stone-900">How M-Pesa payment works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Enter your Safaricom M-Pesa number below.</li>
          <li>A payment prompt (STK push) for {formatKes(amountKes)} appears on your phone.</li>
          <li>Enter your M-Pesa PIN – your booking is confirmed instantly.</li>
        </ol>
      </div>
      <div>
        <label className="label" htmlFor="mpesaPhone">M-Pesa phone number</label>
        <input
          id="mpesaPhone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
          placeholder="07XX XXX XXX"
          autoComplete="tel"
        />
        <p className="mt-1 text-xs text-stone-500">Accepted formats: 07XX…, 01XX…, +2547XX…</p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={stage === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mpesa px-6 py-3 font-semibold text-white shadow-lg shadow-mpesa/30 transition hover:bg-mpesa-dark disabled:opacity-60"
      >
        {stage === "sending" ? "Sending prompt…" : `Send M-Pesa prompt for ${formatKes(amountKes)}`}
      </button>
      <p className="text-center text-xs text-stone-500">
        Paybill payments processed via Safaricom Daraja · Booking {reference}
      </p>
      <SandboxNote mode={mode} text="No real M-Pesa charge is made. Enter any valid Kenyan number to simulate the prompt." />
      <p className="text-center text-xs text-stone-500">
        Trouble paying? Call {site.phoneDisplay}
      </p>
    </form>
  );
}

function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function PhoneVibrateIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M12 17.5h.01M4 9v6M20 9v6" strokeLinecap="round" />
    </svg>
  );
}
