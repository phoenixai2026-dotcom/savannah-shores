import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kenya Safaris",
  description:
    "Tripadvisor-rated Kenya safaris to the Maasai Mara, Amboseli, Samburu and Tsavo. Pay with Visa, Mastercard or M-Pesa.",
};

export default function SafarisPage() {
  return (
    <CategoryPage
      category="safari"
      eyebrow="Kenya safaris"
      title="Big Five safaris"
      intro="From the Great Migration in the Maasai Mara to Kilimanjaro views in Amboseli – expertly guided safaris in private 4x4s, rated Excellent by travellers on Tripadvisor."
      image="https://images.pexels.com/photos/27832452/pexels-photo-27832452.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1800"
    />
  );
}
