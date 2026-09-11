import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingContact } from "@/components/floating-contact";
import { ShareEditBar } from "@/components/share-edit-bar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} · Kenya Safaris & Beach Holidays`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Kenya safari",
    "Maasai Mara",
    "Diani beach holiday",
    "Tripadvisor rated tour operator",
    "pay with M-Pesa",
    "pay with Visa",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <ShareEditBar />
        <main>{children}</main>
        <SiteFooter />
        <FloatingContact />
      </body>
    </html>
  );
}
