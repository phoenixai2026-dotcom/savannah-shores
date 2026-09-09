import { db } from "@/db";
import { bookings, payments } from "@/db/schema";
import { SANDBOX_STK_DELAY_MS, generateMpesaReceipt } from "@/lib/payments/mpesa";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const paymentId = Number(id);
  if (!paymentId) return Response.json({ error: "Invalid payment id." }, { status: 400 });

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) return Response.json({ error: "Payment not found." }, { status: 404 });

  const [booking] = await db
    .select({ reference: bookings.reference })
    .from(bookings)
    .where(eq(bookings.id, payment.bookingId))
    .limit(1);

  let current = payment;

  // Sandbox mode: emulate the customer confirming the STK prompt on their handset.
  if (
    current.status === "pending" &&
    current.method === "mpesa" &&
    current.mode === "sandbox" &&
    Date.now() - new Date(current.createdAt).getTime() >= SANDBOX_STK_DELAY_MS
  ) {
    const receipt = generateMpesaReceipt();
    const [updated] = await db
      .update(payments)
      .set({ status: "paid", providerRef: receipt, updatedAt: new Date() })
      .where(eq(payments.id, current.id))
      .returning();
    await db
      .update(bookings)
      .set({ status: "confirmed", updatedAt: new Date() })
      .where(eq(bookings.id, current.bookingId));
    current = updated;
  }

  return Response.json({
    id: current.id,
    status: current.status,
    method: current.method,
    mode: current.mode,
    receipt: current.providerRef,
    failureReason: current.failureReason,
    reference: booking?.reference ?? null,
  });
}
