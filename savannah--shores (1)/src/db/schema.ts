import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const listingCategoryEnum = pgEnum("listing_category", ["safari", "beach"]);
export const paymentMethodEnum = pgEnum("payment_method", ["visa", "mpesa"]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "cancelled",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending_payment",
  "confirmed",
  "cancelled",
]);

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: listingCategoryEnum("category").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  durationDays: integer("duration_days").notNull(),
  priceUsd: integer("price_usd").notNull(),
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  includes: jsonb("includes").$type<string[]>().notNull().default([]),
  tripadvisorRating: real("tripadvisor_rating").notNull(),
  tripadvisorReviewCount: integer("tripadvisor_review_count").notNull(),
  tripadvisorUrl: text("tripadvisor_url").notNull(),
  tripadvisorAward: text("tripadvisor_award"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  authorLocation: text("author_location").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  reviewedAt: text("reviewed_at").notNull(),
  source: text("source").notNull().default("tripadvisor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  travelDate: text("travel_date").notNull(),
  guests: integer("guests").notNull(),
  notes: text("notes"),
  paymentPlan: text("payment_plan").notNull().default("full"),
  totalUsd: integer("total_usd").notNull(),
  totalKes: integer("total_kes").notNull(),
  amountDueUsd: integer("amount_due_usd").notNull(),
  amountDueKes: integer("amount_due_kes").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending_payment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  providerRef: text("provider_ref"),
  checkoutRequestId: text("checkout_request_id"),
  merchantRequestId: text("merchant_request_id"),
  mpesaPhone: text("mpesa_phone"),
  cardBrand: text("card_brand"),
  cardLast4: text("card_last4"),
  failureReason: text("failure_reason"),
  mode: text("mode").notNull().default("sandbox"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Listing = typeof listings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
