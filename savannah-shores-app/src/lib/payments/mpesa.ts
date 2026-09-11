import { randomInt } from "crypto";

/**
 * Normalises any Kenyan mobile number format into the 2547XXXXXXXX / 2541XXXXXXXX
 * MSISDN format that Safaricom's Daraja API expects.
 */
export function normalizeKenyanPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("254")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^(7|1)\d{8}$/.test(digits)) return null;
  return `254${digits}`;
}

export function formatKenyanPhone(msisdn: string) {
  const local = msisdn.replace(/^254/, "");
  return `+254 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

const mpesaEnv = () => ({
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  environment: process.env.MPESA_ENV === "production" ? "production" : "sandbox",
});

/** Live mode is enabled only when the full set of Daraja credentials is present. */
export function isMpesaLive() {
  const env = mpesaEnv();
  return Boolean(
    env.consumerKey && env.consumerSecret && env.shortcode && env.passkey && env.callbackUrl,
  );
}

function darajaBaseUrl() {
  return mpesaEnv().environment === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function darajaTimestamp() {
  // Daraja expects the timestamp in East Africa Time (UTC+3).
  const eat = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${eat.getUTCFullYear()}${pad(eat.getUTCMonth() + 1)}${pad(eat.getUTCDate())}` +
    `${pad(eat.getUTCHours())}${pad(eat.getUTCMinutes())}${pad(eat.getUTCSeconds())}`
  );
}

async function getDarajaToken() {
  const { consumerKey, consumerSecret } = mpesaEnv();
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(`${darajaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Daraja auth returned no token");
  return data.access_token;
}

export type StkPushResult = {
  mode: "live" | "sandbox";
  checkoutRequestId: string;
  merchantRequestId: string;
  customerMessage: string;
};

export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<StkPushResult> {
  const amount = Math.max(1, Math.round(params.amount));

  if (!isMpesaLive()) {
    // Sandbox simulation: mimics the Daraja response so the checkout flow is identical.
    const stamp = darajaTimestamp();
    return {
      mode: "sandbox",
      checkoutRequestId: `ws_CO_${stamp}${randomInt(100000, 999999)}`,
      merchantRequestId: `${randomInt(10000, 99999)}-${randomInt(10000000, 99999999)}-1`,
      customerMessage: "Success. Request accepted for processing",
    };
  }

  const { shortcode, passkey, callbackUrl } = mpesaEnv();
  const token = await getDarajaToken();
  const timestamp = darajaTimestamp();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  const res = await fetch(`${darajaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: params.phone,
      PartyB: shortcode,
      PhoneNumber: params.phone,
      CallBackURL: callbackUrl,
      AccountReference: params.reference.slice(0, 12),
      TransactionDesc: params.description.slice(0, 13),
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    ResponseCode?: string;
    CheckoutRequestID?: string;
    MerchantRequestID?: string;
    CustomerMessage?: string;
    errorMessage?: string;
    ResponseDescription?: string;
  };

  if (!res.ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    throw new Error(data.errorMessage ?? data.ResponseDescription ?? "M-Pesa request was rejected");
  }

  return {
    mode: "live",
    checkoutRequestId: data.CheckoutRequestID,
    merchantRequestId: data.MerchantRequestID ?? "",
    customerMessage: data.CustomerMessage ?? "Request accepted for processing",
  };
}

/** Generates an M-Pesa style receipt number (10 uppercase alphanumerics). */
export function generateMpesaReceipt() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const alphanum = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 3; i++) out += letters[randomInt(letters.length)];
  for (let i = 0; i < 7; i++) out += alphanum[randomInt(alphanum.length)];
  return out;
}

/** Seconds a sandbox STK push stays "pending" before it is auto-confirmed. */
export const SANDBOX_STK_DELAY_MS = 7000;

export type DarajaCallbackBody = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] };
    };
  };
};

export function parseDarajaCallback(body: DarajaCallbackBody) {
  const cb = body.Body?.stkCallback;
  if (!cb?.CheckoutRequestID) return null;
  const items = cb.CallbackMetadata?.Item ?? [];
  const item = (name: string) => items.find((i) => i.Name === name)?.Value;
  return {
    checkoutRequestId: cb.CheckoutRequestID,
    merchantRequestId: cb.MerchantRequestID ?? null,
    resultCode: Number(cb.ResultCode ?? -1),
    resultDesc: cb.ResultDesc ?? "",
    receipt: item("MpesaReceiptNumber") ? String(item("MpesaReceiptNumber")) : null,
    amount: item("Amount") ? Number(item("Amount")) : null,
    phone: item("PhoneNumber") ? String(item("PhoneNumber")) : null,
  };
}
