import { db } from "@/db";
import { bookings, payments } from "@/db/schema";
import { parseDarajaCallback, type DarajaCallbackBody } from "@/lib/payments/mpesa";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Safaricom Daraja STK Push result callback.
 * Configure MPESA_CALLBACK_URL to point at this route (must be publicly reachable over HTTPS).
 */
export async function POST(request: Request) {
  let body: DarajaCallbackBody;
  try {
    body = (await request.json()) as DarajaCallbackBody;
  } catch {
    return Response.json({ ResultCode: 1, ResultDesc: "Invalid payload" }, { status: 400 });
  }

  const result = parseDarajaCallback(body);
  if (!result) {
    return Response.json({ ResultCode: 1, ResultDesc: "Missing stkCallback" }, { status: 400 });
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.checkoutRequestId, result.checkoutRequestId))
    .limit(1);

  if (!payment) {
    // Always acknowledge so Safaricom does not retry indefinitely.
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  if (payment.status === "pending") {
    if (result.resultCode === 0) {
      await db
        .update(payments)
        .set({
          status: "paid",
          providerRef: result.receipt,
          mpesaPhone: result.phone ?? payment.mpesaPhone,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));
      await db
        .update(bookings)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(eq(bookings.id, payment.bookingId));
    } else {
      await db
        .update(payments)
        .set({
          status: result.resultCode === 1032 ? "cancelled" : "failed",
          failureReason: result.resultDesc,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));
    }
  }

  return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
