import Link from "next/link";
import { site, telLink } from "@/lib/site";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { PaymentMethodsStrip } from "@/components/payment-logos";
import { TripadvisorBubbles, TripadvisorOwl } from "@/components/tripadvisor";
import { PhoneIcon } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-forest-900 text-white">
      <div className="texture-dots">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-savanna-500 font-display text-lg font-bold">
                S
              </span>
              <span className="font-display text-xl font-semibold">{site.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{site.description}</p>
            <a
              href={site.tripadvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-stone-900 transition hover:ring-2 hover:ring-ta"
            >
              <TripadvisorOwl className="h-8 w-8 text-ta-dark" />
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-wide text-stone-500">
                  Tripadvisor · {site.tripadvisorAward}
                </span>
                <span className="flex items-center gap-2">
                  <TripadvisorBubbles rating={site.tripadvisorRating} className="h-3.5" />
                  <span className="text-sm font-semibold">
                    {site.tripadvisorRating.toFixed(1)} ({site.tripadvisorReviewCount.toLocaleString()})
                  </span>
                </span>
              </span>
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-400">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><Link href="/safaris" className="hover:text-white">Kenya Safaris</Link></li>
              <li><Link href="/beach" className="hover:text-white">Beach Holidays</Link></li>
              <li><Link href="/reviews" className="hover:text-white">Tripadvisor Reviews</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/admin" className="hover:text-white">Bookings Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-400">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <a href={telLink} className="flex items-center gap-2 text-base font-semibold text-white hover:text-ta">
                  <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
                </a>
                <span className="text-xs text-white/50">Calls & SMS · {site.hours}</span>
              </li>
              <li>
                <WhatsAppLink message="Hello Savanna & Shores, I would like to make a booking." className="flex items-center gap-2 hover:text-white">
                  <WhatsAppIcon className="h-4 w-4 text-mpesa" /> WhatsApp {site.phoneDisplay}
                </WhatsAppLink>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
              </li>
              <li className="text-white/60">{site.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-savanna-400">Secure payments</h3>
            <p className="mt-4 text-sm text-white/70">
              Pay for any safari or beach holiday with Visa, Mastercard or M-Pesa. Full payment or a{" "}
              {site.depositPercent}% deposit to secure your dates.
            </p>
            <PaymentMethodsStrip className="mt-4" label={null} size="h-9" tone="dark" />
            <p className="mt-3 text-xs text-white/50">
              M-Pesa Paybill via Safaricom STK push · Card payments encrypted end to end.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. Licensed Kenyan tour operator.</p>
          <p>Tripadvisor ratings shown for every safari and beach package.</p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.1 4.4c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.4z" />
    </svg>
  );
}
