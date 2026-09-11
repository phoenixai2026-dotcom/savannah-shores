export const site = {
  name: "Savanna & Shores Kenya",
  shortName: "Savanna & Shores",
  tagline: "Safaris and beach holidays, rated Excellent on Tripadvisor.",
  description:
    "Award-winning Kenyan safaris and coastal beach holidays. Book securely online with Visa, Mastercard or M-Pesa.",
  phoneDisplay: "+254 723 444 320",
  phoneE164: "+254723444320",
  phoneRaw: "254723444320",
  email: "bookings@savannaandshores.co.ke",
  address: "Westlands, Nairobi, Kenya",
  hours: "Mon – Sun, 7:00am – 9:00pm EAT",
  tripadvisorUrl: "https://www.tripadvisor.com/Search?q=Savanna+%26+Shores+Kenya",
  tripadvisorRating: 4.9,
  tripadvisorReviewCount: 1863,
  tripadvisorAward: "Travellers' Choice 2025",
  usdToKes: 129,
  depositPercent: 30,
} as const;

export const whatsappLink = (
  message?: string,
  destination: "app" | "web" = "app",
) => {
  // Use the full international number without spaces or a leading +.
  // Direct send links avoid relying on the wa.me short-link redirect.
  const url = new URL(
    destination === "web"
      ? "https://web.whatsapp.com/send"
      : "https://api.whatsapp.com/send",
  );
  url.searchParams.set("phone", site.phoneE164.replace(/\D/g, ""));
  if (message?.trim()) url.searchParams.set("text", message.trim());
  return url.toString();
};

export const telLink = `tel:${site.phoneE164}`;

export const usdToKes = (usd: number) => Math.round(usd * site.usdToKes);

export const formatUsd = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatKes = (amount: number) =>
  `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount)}`;

export const categoryLabel: Record<"safari" | "beach", string> = {
  safari: "Safari",
  beach: "Beach Holiday",
};

export const categoryPath: Record<"safari" | "beach", string> = {
  safari: "/safaris",
  beach: "/beach",
};
