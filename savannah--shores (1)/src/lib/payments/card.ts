import { randomInt } from "crypto";

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export function luhnCheck(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(number: string): CardBrand {
  const d = number.replace(/\D/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  return "unknown";
}

export const cardBrandLabel: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  unknown: "Card",
};

export type CardInput = {
  name: string;
  number: string;
  expMonth: string;
  expYear: string;
  cvv: string;
};

export type CardValidation =
  | { ok: true; brand: CardBrand; last4: string }
  | { ok: false; error: string };

export function validateCard(input: CardInput): CardValidation {
  const number = input.number.replace(/\s|-/g, "");
  if (!input.name || input.name.trim().length < 2) {
    return { ok: false, error: "Enter the name printed on the card." };
  }
  if (!/^\d{13,19}$/.test(number) || !luhnCheck(number)) {
    return { ok: false, error: "The card number is invalid. Please check and try again." };
  }
  const brand = detectCardBrand(number);
  if (brand !== "visa" && brand !== "mastercard") {
    return { ok: false, error: "We accept Visa and Mastercard only." };
  }
  const month = Number(input.expMonth);
  let year = Number(input.expYear);
  if (year < 100) year += 2000;
  if (!month || month < 1 || month > 12 || !year) {
    return { ok: false, error: "Enter a valid expiry date (MM/YY)." };
  }
  const now = new Date();
  const expires = new Date(year, month, 0, 23, 59, 59);
  if (expires < now) {
    return { ok: false, error: "This card has expired." };
  }
  if (!/^\d{3,4}$/.test(input.cvv)) {
    return { ok: false, error: "Enter the 3-digit security code (CVV)." };
  }
  return { ok: true, brand, last4: number.slice(-4) };
}

/** Card processing runs in sandbox mode unless a gateway is configured. */
export function isCardLive() {
  return Boolean(process.env.CARD_GATEWAY_SECRET_KEY);
}

export function generateAuthCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[randomInt(chars.length)];
  return out;
}
