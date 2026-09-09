import { db } from "@/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const listingId = Number(id);
  if (!listingId) {
    return Response.json({ error: "Invalid package ID." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const tagline = String(body.tagline ?? "").trim();
  const description = String(body.description ?? "").trim();
  const location = String(body.location ?? "").trim();
  const durationDays = Math.max(1, Number(body.durationDays) || 1);
  const priceUsd = Math.max(1, Number(body.priceUsd) || 1);
  const imageUrl = String(body.imageUrl ?? "").trim();
  const tripadvisorRating = Math.min(
    5,
    Math.max(1, Number(body.tripadvisorRating) || 4.9),
  );
  const tripadvisorReviewCount = Math.max(
    0,
    Number(body.tripadvisorReviewCount) || 1,
  );
  const tripadvisorUrl = String(body.tripadvisorUrl ?? "").trim();
  const tripadvisorAward = body.tripadvisorAward
    ? String(body.tripadvisorAward).trim()
    : null;
  const featured = Boolean(body.featured);

  if (!name || !tagline || !description || !location || !imageUrl) {
    return Response.json(
      { error: "Name, tagline, description, location and image URL are required." },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(listings)
    .set({
      name,
      tagline,
      description,
      location,
      durationDays,
      priceUsd,
      imageUrl,
      tripadvisorRating,
      tripadvisorReviewCount,
      tripadvisorUrl:
        tripadvisorUrl ||
        `https://www.tripadvisor.com/Search?q=${encodeURIComponent(name)}`,
      tripadvisorAward,
      featured,
    })
    .where(eq(listings.id, listingId))
    .returning();

  if (!updated) {
    return Response.json({ error: "Package not found." }, { status: 404 });
  }

  return Response.json({ ok: true, listing: updated });
}
