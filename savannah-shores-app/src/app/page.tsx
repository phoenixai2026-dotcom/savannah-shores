import Link from "next/link";
import { getAllReviews, getFeaturedListings } from "@/lib/data";
import { site, telLink } from "@/lib/site";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ListingCard } from "@/components/listing-card";
import { ReviewCard, TripadvisorBadge, TripadvisorBubbles, TripadvisorOwl } from "@/components/tripadvisor";
import { MastercardLogo, MpesaLogo, PaymentMethodsStrip, VisaLogo } from "@/components/payment-logos";
import { PhoneIcon } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/site-footer";

export const dynamic = "force-dynamic";

const heroImage =
  "https://images.pexels.com/photos/19294855/pexels-photo-19294855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800";
const safariImage =
  "https://images.pexels.com/photos/35717988/pexels-photo-35717988.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000";
const beachImage =
  "https://images.pexels.com/photos/20693411/pexels-photo-20693411.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000";

export default async function HomePage() {
  const [featured, allReviews] = await Promise.all([getFeaturedListings(), getAllReviews()]);
  const topReviews = allReviews.filter((r) => r.review.rating === 5).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="Elephants crossing the Kenyan savannah"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/90 via-forest-900/60 to-forest-900/20" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <a
              href={site.tripadvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <TripadvisorOwl className="h-5 w-5 text-ta" />
              <TripadvisorBubbles rating={site.tripadvisorRating} className="h-3.5" />
              <span className="font-semibold">{site.tripadvisorRating.toFixed(1)}</span>
              <span className="text-white/70">
                · {site.tripadvisorReviewCount.toLocaleString()} reviews · {site.tripadvisorAward}
              </span>
            </a>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Wild savannah. <br />
              <span className="text-savanna-400">Warm Indian Ocean.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Tripadvisor-rated Kenyan safaris and beach holidays, booked in minutes. Secure your dates
              online with Visa, Mastercard or M-Pesa – or call us on{" "}
              <a href={telLink} className="font-semibold text-white underline decoration-savanna-400 underline-offset-4">
                {site.phoneDisplay}
              </a>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/safaris" className="btn-primary">
                Explore safaris
              </Link>
              <Link href="/beach" className="btn-secondary !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
                Beach holidays
              </Link>
            </div>
            <PaymentMethodsStrip className="mt-10" label="Pay securely with" size="h-9" tone="dark" />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <TrustItem
            icon={<TripadvisorOwl className="h-7 w-7 text-ta-dark" />}
            title="Excellent on Tripadvisor"
            text={`${site.tripadvisorRating.toFixed(1)}/5 across ${site.tripadvisorReviewCount.toLocaleString()} traveller reviews`}
          />
          <TrustItem
            icon={<MpesaLogo className="h-7" />}
            title="M-Pesa & card payments"
            text="Pay in KES via M-Pesa or in USD with Visa / Mastercard"
          />
          <TrustItem
            icon={<PhoneIcon className="h-6 w-6 text-savanna-600" />}
            title={site.phoneDisplay}
            text="Talk to a Kenyan travel expert, 7 days a week"
          />
          <TrustItem
            icon={<ShieldIcon className="h-6 w-6 text-forest-700" />}
            title="Licensed & insured"
            text="Registered Kenyan tour operator, flying doctors cover on every trip"
          />
        </div>
      </section>

      {/* Both categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-600">Two ways to Kenya</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-stone-900">
            Safari, beach – or both
          </h2>
          <p className="mt-3 text-stone-600">
            Every package is rated on Tripadvisor and can be paid for with Visa, Mastercard or M-Pesa.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <CategoryCard
            href="/safaris"
            image={safariImage}
            eyebrow="Big Five country"
            title="Kenya Safaris"
            text="Maasai Mara, Amboseli, Samburu, Tsavo – guided by the people who grew up there."
            accent="bg-savanna-500"
          />
          <CategoryCard
            href="/beach"
            image={beachImage}
            eyebrow="Indian Ocean coast"
            title="Beach Holidays"
            text="Diani, Watamu, Lamu and Mombasa – white sand, coral reefs and Swahili culture."
            accent="bg-ocean-500"
          />
        </div>
      </section>

      {/* Featured */}
      <section className="bg-sand-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-600">Travellers' favourites</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-stone-900">Featured packages</h2>
            </div>
            <TripadvisorBadge
              rating={site.tripadvisorRating}
              reviewCount={site.tripadvisorReviewCount}
              url={site.tripadvisorUrl}
              size="md"
            />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Payment options */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-600">Flexible payments</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-stone-900">
              Pay your way: Visa, Mastercard or M-Pesa
            </h2>
            <p className="mt-4 text-stone-600">
              Both safari and beach bookings can be paid in full or secured with a {site.depositPercent}%
              deposit. International guests pay in USD by card; Kenyan residents can pay in KES straight
              from their phone with an M-Pesa STK push.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex shrink-0 items-center gap-1.5">
                  <VisaLogo className="h-9" />
                  <MastercardLogo className="h-9" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Visa & Mastercard</p>
                  <p className="text-sm text-stone-600">
                    Debit or credit cards, charged in USD with instant confirmation and e-receipt.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex shrink-0 items-center">
                  <MpesaLogo className="h-9" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">M-Pesa</p>
                  <p className="text-sm text-stone-600">
                    Enter your Safaricom number, receive the STK prompt, confirm with your PIN. Receipt
                    number saved to your booking.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-forest-900 p-8 text-white texture-dots">
            <h3 className="font-display text-2xl font-semibold">How booking works</h3>
            <ol className="mt-6 space-y-5">
              {[
                ["Choose a package", "Pick a safari or beach holiday – or combine both."],
                ["Enter your details", "Travel date, number of guests and your contact information."],
                ["Pay securely", "Visa / Mastercard in USD or M-Pesa in KES. Full amount or deposit."],
                ["Get confirmed", "Instant confirmation page, reference number and payment receipt."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-savanna-500 text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-white/70">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-white/70">
              Need help? Call or WhatsApp{" "}
              <a href={telLink} className="font-semibold text-white">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-ta-dark">
                <TripadvisorOwl className="h-5 w-5" /> Tripadvisor reviews
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-stone-900">
                What travellers say about us
              </h2>
            </div>
            <Link href="/reviews" className="btn-secondary">
              Read all reviews
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {topReviews.map(({ review, listing }) => (
              <ReviewCard
                key={review.id}
                review={review}
                listingName={listing.name}
                listingHref={`/packages/${listing.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-savanna-500 p-8 text-white md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-3xl font-semibold">Ready to plan your Kenyan adventure?</h2>
            <p className="mt-2 text-white/90">
              Speak to our team on {site.phoneDisplay} – calls, SMS and WhatsApp welcome.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={telLink} className="btn-secondary">
              <PhoneIcon className="h-4 w-4" /> Call {site.phoneDisplay}
            </a>
            <WhatsAppLink
              message="Hello Savanna & Shores, I would like to plan a trip."
              className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3 font-semibold text-white hover:bg-forest-800"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </>
  );
}

function TrustItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand-100">{icon}</div>
      <div>
        <p className="font-semibold text-stone-900">{title}</p>
        <p className="text-sm text-stone-600">{text}</p>
      </div>
    </div>
  );
}

function CategoryCard({
  href,
  image,
  eyebrow,
  title,
  text,
  accent,
}: {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[320px] items-end overflow-hidden rounded-3xl bg-forest-900 text-white shadow-lg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative p-8">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${accent}`}>
          {eyebrow}
        </span>
        <h3 className="mt-3 font-display text-3xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-md text-white/80">{text}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
          View packages
          <svg className="h-4 w-4 transition group-hover:translate-x-1" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function ShieldIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
