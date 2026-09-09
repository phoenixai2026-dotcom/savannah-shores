import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beach Holidays",
  description:
    "Tripadvisor-rated Kenyan beach holidays in Diani, Watamu, Lamu and Mombasa. Pay with Visa, Mastercard or M-Pesa.",
};

export default function BeachPage() {
  return (
    <CategoryPage
      category="beach"
      eyebrow="Indian Ocean coast"
      title="Beach holidays"
      intro="White-sand beaches, coral reefs and Swahili heritage along Kenya's coast – Diani, Watamu, Lamu and Mombasa – each package reviewed by real travellers on Tripadvisor."
      image="https://images.pexels.com/photos/38376805/pexels-photo-38376805.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1800"
    />
  );
}
