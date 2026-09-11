import { db } from "@/db";
import { bookings, payments } from "@/db/schema";
import { getBookingByReference } from "@/lib/data";
import { cardBrandLabel, generateAuthCode, isCardLive, validateCard } from "@/lib/payments/card";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Payload = {
  reference?: string;
  name?: string;
  number?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const reference = (body.reference ?? "").trim().toUpperCase();
  if (!reference) return Response.json({ error: "Missing booking reference." }, { status: 400 });

  const row = await getBookingByReference(reference);
  if (!row) return Response.json({ error: "Booking not found." }, { status: 404 });
  if (row.booking.status === "confirmed") {
    return Response.json({ error: "This booking has already been paid." }, { status: 409 });
  }
  if (row.booking.status === "cancelled") {
    return Response.json({ error: "This booking has been cancelled." }, { status: 409 });
  }

  const validation = validateCard({
    name: body.name ?? "",
    number: body.number ?? "",
    expMonth: body.expMonth ?? "",
    expYear: body.expYear ?? "",
    cvv: body.cvv ?? "",
  });

  const amount = row.booking.amountDueUsd;
  const mode = isCardLive() ? "live" : "sandbox";

  if (!validation.ok) {
    await db.insert(payments).values({
      bookingId: row.booking.id,
      method: "visa",
      status: "failed",
      amount,
      currency: "USD",
      failureReason: validation.error,
      mode,
    });
    return Response.json({ error: validation.error }, { status: 422 });
  }

  // Only the brand and last four digits are ever persisted – never the PAN or CVV.
  const authCode = generateAuthCode();
  const [payment] = await db
    .insert(payments)
    .values({
      bookingId: row.booking.id,
      method: "visa",
      status: "paid",
      amount,
      currency: "USD",
      providerRef: authCode,
      cardBrand: validation.brand,
      cardLast4: validation.last4,
      mode,
    })
    .returning();

  await db
    .update(bookings)
    .set({ status: "confirmed", updatedAt: new Date() })
    .where(eq(bookings.id, row.booking.id));

  return Response.json({
    ok: true,
    reference,
    paymentId: payment.id,
    brand: cardBrandLabel[validation.brand],
    last4: validation.last4,
    authCode,
  });
}
