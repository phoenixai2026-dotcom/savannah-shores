export function VisaLogo({ className = "h-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border border-stone-200 bg-white px-2.5 ${className}`}
      aria-label="Visa"
      title="Visa"
    >
      <svg viewBox="0 0 48 16" className="h-[55%] w-auto" aria-hidden="true">
        <text
          x="0"
          y="14"
          fontFamily="Arial Black, Arial, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="17"
          fill="#1a1f71"
          letterSpacing="-0.5"
        >
          VISA
        </text>
      </svg>
    </span>
  );
}

export function MastercardLogo({ className = "h-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border border-stone-200 bg-white px-2.5 ${className}`}
      aria-label="Mastercard"
      title="Mastercard"
    >
      <svg viewBox="0 0 38 24" className="h-[70%] w-auto" aria-hidden="true">
        <circle cx="13" cy="12" r="10" fill="#eb001b" />
        <circle cx="25" cy="12" r="10" fill="#f79e1b" />
        <path
          d="M19 4.3a10 10 0 0 1 0 15.4 10 10 0 0 1 0-15.4z"
          fill="#ff5f00"
        />
      </svg>
    </span>
  );
}

export function MpesaLogo({ className = "h-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-mpesa px-2.5 ${className}`}
      aria-label="M-Pesa"
      title="M-Pesa"
    >
      <span className="flex items-center gap-1 text-white">
        <svg viewBox="0 0 24 24" className="h-[60%] w-auto" fill="none" aria-hidden="true">
          <rect x="6" y="2" width="12" height="20" rx="2.5" fill="#fff" />
          <rect x="8" y="5" width="8" height="11" rx="1" fill="#3fb54a" />
          <circle cx="12" cy="18.5" r="1.2" fill="#3fb54a" />
        </svg>
        <span className="text-[0.7em] font-extrabold tracking-tight">M-PESA</span>
      </span>
    </span>
  );
}

export function PaymentMethodsStrip({
  className = "",
  label = "We accept",
  size = "h-8",
  tone = "light",
}: {
  className?: string;
  label?: string | null;
  size?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {label ? (
        <span
          className={`mr-1 text-xs font-medium uppercase tracking-wide ${
            tone === "dark" ? "text-white/60" : "text-stone-500"
          }`}
        >
          {label}
        </span>
      ) : null}
      <VisaLogo className={size} />
      <MastercardLogo className={size} />
      <MpesaLogo className={size} />
    </div>
  );
}
