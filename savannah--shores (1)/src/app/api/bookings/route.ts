import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getListingById } from "@/lib/data";
import { site, usdToKes } from "@/lib/site";
import { generateBookingReference, isValidEmail } from "@/lib/utils";
import { normalizeKenyanPhone } from "@/lib/payments/mpesa";

export const dynamic = "force-dynamic";

type Payload = {
  listingId?: number;
  customerName?: string;
  email?: string;
  phone?: string;
  travelDate?: string;
  guests?: number;
  paymentPlan?: "full" | "deposit";
  notes?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  const customerName = (body.customerName ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phoneInput = (body.phone ?? "").trim();
  const travelDate = (body.travelDate ?? "").trim();
  const guests = Math.floor(Number(body.guests));
  const paymentPlan = body.paymentPlan === "deposit" ? "deposit" : "full";
  const notes = (body.notes ?? "").trim().slice(0, 1000);

  if (!listingId) return Response.json({ error: "Select a package to book." }, { status: 400 });
  if (customerName.length < 2) return Response.json({ error: "Enter your full name." }, { status: 400 });
  if (!isValidEmail(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (phoneInput.replace(/\D/g, "").length < 9) {
    return Response.json({ error: "Enter a valid phone number." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(travelDate) || Number.isNaN(new Date(travelDate).getTime())) {
    return Response.json({ error: "Choose a travel date." }, { status: 400 });
  }
  if (new Date(travelDate) < new Date(new Date().toDateString())) {
    return Response.json({ error: "Travel date must be in the future." }, { status: 400 });
  }
  if (!guests || guests < 1 || guests > 12) {
    return Response.json({ error: "Guests must be between 1 and 12." }, { status: 400 });
  }

  const listing = await getListingById(listingId);
  if (!listing) return Response.json({ error: "Package not found." }, { status: 404 });

  const totalUsd = listing.priceUsd * guests;
  const amountDueUsd =
    paymentPlan === "full" ? totalUsd : Math.ceil((totalUsd * site.depositPercent) / 100);

  // Store a normalised Kenyan number when possible so M-Pesa can be pre-filled.
  const normalised = normalizeKenyanPhone(phoneInput);
  const phone = normalised ? `+${normalised}` : phoneInput;

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = generateBookingReference();
    try {
      const [created] = await db
        .insert(bookings)
        .values({
          reference,
          listingId: listing.id,
          customerName,
          email,
          phone,
          travelDate,
          guests,
          notes: notes || null,
          paymentPlan,
          totalUsd,
          totalKes: usdToKes(totalUsd),
          amountDueUsd,
          amountDueKes: usdToKes(amountDueUsd),
        })
        .returning({ reference: bookings.reference });
      return Response.json({ reference: created.reference }, { status: 201 });
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code !== "23505") throw error; // retry only on reference collision
    }
  }

  return Response.json({ error: "Could not allocate a booking reference." }, { status: 500 });
}
