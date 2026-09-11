import { db } from "@/db";
import { payments } from "@/db/schema";
import { getBookingByReference } from "@/lib/data";
import { formatKenyanPhone, initiateStkPush, normalizeKenyanPhone } from "@/lib/payments/mpesa";

export const dynamic = "force-dynamic";

type Payload = { reference?: string; phone?: string };

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const reference = (body.reference ?? "").trim().toUpperCase();
  if (!reference) return Response.json({ error: "Missing booking reference." }, { status: 400 });

  const phone = normalizeKenyanPhone(body.phone ?? "");
  if (!phone) {
    return Response.json(
      { error: "Enter a valid Safaricom number, e.g. 0712 345 678 or +254 712 345 678." },
      { status: 422 },
    );
  }

  const row = await getBookingByReference(reference);
  if (!row) return Response.json({ error: "Booking not found." }, { status: 404 });
  if (row.booking.status === "confirmed") {
    return Response.json({ error: "This booking has already been paid." }, { status: 409 });
  }
  if (row.booking.status === "cancelled") {
    return Response.json({ error: "This booking has been cancelled." }, { status: 409 });
  }

  const amount = row.booking.amountDueKes;

  try {
    const stk = await initiateStkPush({
      phone,
      amount,
      reference,
      description: "SavannaShores",
    });

    const [payment] = await db
      .insert(payments)
      .values({
        bookingId: row.booking.id,
        method: "mpesa",
        status: "pending",
        amount,
        currency: "KES",
        checkoutRequestId: stk.checkoutRequestId,
        merchantRequestId: stk.merchantRequestId,
        mpesaPhone: phone,
        mode: stk.mode,
      })
      .returning();

    return Response.json({
      ok: true,
      paymentId: payment.id,
      mode: stk.mode,
      phone: formatKenyanPhone(phone),
      amount,
      message: stk.customerMessage,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "M-Pesa request failed.";
    await db.insert(payments).values({
      bookingId: row.booking.id,
      method: "mpesa",
      status: "failed",
      amount,
      currency: "KES",
      mpesaPhone: phone,
      failureReason: message,
      mode: "live",
    });
    return Response.json({ error: message }, { status: 502 });
  }
}
