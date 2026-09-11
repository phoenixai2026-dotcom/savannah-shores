import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { isValidEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();
  const subject = (body.subject ?? "").trim() || "General enquiry";
  const message = (body.message ?? "").trim();

  if (name.length < 2) return Response.json({ error: "Enter your name." }, { status: 400 });
  if (!isValidEmail(email)) return Response.json({ error: "Enter a valid email." }, { status: 400 });
  if (message.length < 10) {
    return Response.json({ error: "Tell us a little more (at least 10 characters)." }, { status: 400 });
  }

  const [created] = await db
    .insert(inquiries)
    .values({ name, email, phone: phone || null, subject: subject.slice(0, 200), message: message.slice(0, 4000) })
    .returning({ id: inquiries.id });

  return Response.json({ ok: true, id: created.id }, { status: 201 });
}
