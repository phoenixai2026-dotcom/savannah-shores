import { site, telLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site-footer";
import { PhoneIcon } from "@/components/site-header";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function FloatingContact() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2 sm:right-6">
      <a
        href={telLink}
        className="pointer-events-auto flex h-11 items-center gap-2 rounded-full bg-forest-900 pl-3 pr-4 text-sm font-semibold text-white shadow-xl ring-1 ring-white/20 transition hover:bg-forest-800"
        aria-label={`Call ${site.phoneDisplay}`}
      >
        <PhoneIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{site.phoneDisplay}</span>
        <span className="sm:hidden">Call</span>
      </a>
      <WhatsAppLink
        message="Hello Savanna & Shores, I would like to enquire about a safari or beach holiday."
        className="pointer-events-auto flex h-12 items-center gap-2 rounded-full bg-mpesa pl-3 pr-4 text-sm font-semibold text-white shadow-xl transition hover:bg-mpesa-dark"
        aria-label={`Chat on WhatsApp with ${site.phoneDisplay}`}
      >
        <WhatsAppIcon className="h-6 w-6" />
        WhatsApp us
      </WhatsAppLink>
    </div>
  );
}
