import { db } from "@/db";
import { bookings, listings, payments, reviews } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { and, asc, desc, eq } from "drizzle-orm";

export async function getListings(category?: "safari" | "beach") {
  await ensureSeeded();
  return db
    .select()
    .from(listings)
    .where(category ? eq(listings.category, category) : undefined)
    .orderBy(desc(listings.featured), desc(listings.tripadvisorRating), asc(listings.id));
}

export async function getFeaturedListings() {
  await ensureSeeded();
  return db
    .select()
    .from(listings)
    .where(eq(listings.featured, true))
    .orderBy(asc(listings.category), desc(listings.tripadvisorRating));
}

export async function getListingBySlug(slug: string) {
  await ensureSeeded();
  const [listing] = await db.select().from(listings).where(eq(listings.slug, slug)).limit(1);
  return listing ?? null;
}

export async function getListingById(id: number) {
  const [listing] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return listing ?? null;
}

export async function getReviewsForListing(listingId: number) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.listingId, listingId))
    .orderBy(desc(reviews.rating), asc(reviews.id));
}

export async function getAllReviews() {
  await ensureSeeded();
  return db
    .select({
      review: reviews,
      listing: {
        id: listings.id,
        slug: listings.slug,
        name: listings.name,
        category: listings.category,
        imageUrl: listings.imageUrl,
        tripadvisorUrl: listings.tripadvisorUrl,
      },
    })
    .from(reviews)
    .innerJoin(listings, eq(reviews.listingId, listings.id))
    .orderBy(desc(reviews.rating), asc(reviews.id));
}

export async function getBookingByReference(reference: string) {
  const [row] = await db
    .select({ booking: bookings, listing: listings })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(bookings.reference, reference.toUpperCase()))
    .limit(1);
  return row ?? null;
}

export async function getPaymentsForBooking(bookingId: number) {
  return db
    .select()
    .from(payments)
    .where(eq(payments.bookingId, bookingId))
    .orderBy(desc(payments.id));
}

export async function getSuccessfulPayment(bookingId: number) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.bookingId, bookingId), eq(payments.status, "paid")))
    .orderBy(desc(payments.id))
    .limit(1);
  return payment ?? null;
}

export async function getRecentBookings(limit = 50) {
  return db
    .select({ booking: bookings, listing: listings })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .orderBy(desc(bookings.id))
    .limit(limit);
}

export async function getRecentPayments(limit = 50) {
  return db
    .select({ payment: payments, booking: bookings })
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .orderBy(desc(payments.id))
    .limit(limit);
}
