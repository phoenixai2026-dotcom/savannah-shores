import type { Metadata } from "next";
import { site, telLink } from "@/lib/site";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ContactForm } from "@/components/contact-form";
import { TripadvisorPanel } from "@/components/tripadvisor";
import { PaymentMethodsStrip } from "@/components/payment-logos";
import { PhoneIcon } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Call or WhatsApp ${site.phoneDisplay} to plan your Kenya safari or beach holiday.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-forest-900 text-white texture-dots">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-400">Contact</p>
          <h1 className="mt-2 font-display text-5xl font-semibold">Talk to a Kenya travel expert</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Call, SMS or WhatsApp us on{" "}
            <a href={telLink} className="font-semibold text-white underline decoration-savanna-400 underline-offset-4">
              {site.phoneDisplay}
            </a>{" "}
            – {site.hours}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telLink} className="btn-primary">
              <PhoneIcon className="h-4 w-4" /> Call {site.phoneDisplay}
            </a>
            <WhatsAppLink
              message="Hello Savanna & Shores, I'd like some help planning a trip."
              className="inline-flex items-center gap-2 rounded-full bg-mpesa px-6 py-3 font-semibold text-white hover:bg-mpesa-dark"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-stone-900">Send us a message</h2>
            <p className="mt-2 text-stone-600">We reply within a few hours, seven days a week.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-900">Contact details</h3>
              <ul className="mt-3 space-y-3 text-sm text-stone-700">
                <li>
                  <span className="block text-xs uppercase tracking-wide text-stone-500">Phone / WhatsApp</span>
                  <a href={telLink} className="text-lg font-semibold text-forest-700">{site.phoneDisplay}</a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-stone-500">Email</span>
                  <a href={`mailto:${site.email}`} className="font-medium">{site.email}</a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-stone-500">Office</span>
                  {site.address}
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wide text-stone-500">Hours</span>
                  {site.hours}
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-900">Payment options</h3>
              <p className="mt-2 text-sm text-stone-600">
                All safari and beach bookings can be paid online with Visa, Mastercard or M-Pesa. Prefer to pay
                over the phone? Call {site.phoneDisplay} and we'll send an M-Pesa prompt or card link.
              </p>
              <PaymentMethodsStrip className="mt-3" label={null} size="h-8" />
            </div>
            <TripadvisorPanel
              name={site.name}
              rating={site.tripadvisorRating}
              reviewCount={site.tripadvisorReviewCount}
              url={site.tripadvisorUrl}
              award={site.tripadvisorAward}
              compact
            />
          </aside>
        </div>
      </section>
    </>
  );
}
