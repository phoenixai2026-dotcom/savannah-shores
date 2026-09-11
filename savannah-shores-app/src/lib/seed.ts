import { db } from "@/db";
import { listings, reviews } from "@/db/schema";
import { count } from "drizzle-orm";

const img = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400`;

const ta = (q: string) => `https://www.tripadvisor.com/Search?q=${encodeURIComponent(q)}`;

type SeedReview = {
  author: string;
  authorLocation: string;
  rating: number;
  title: string;
  body: string;
  reviewedAt: string;
};

type SeedListing = {
  slug: string;
  name: string;
  category: "safari" | "beach";
  tagline: string;
  description: string;
  location: string;
  durationDays: number;
  priceUsd: number;
  imageUrl: string;
  gallery: string[];
  highlights: string[];
  includes: string[];
  tripadvisorRating: number;
  tripadvisorReviewCount: number;
  tripadvisorUrl: string;
  tripadvisorAward: string | null;
  featured: boolean;
  reviews: SeedReview[];
};

const seedListings: SeedListing[] = [
  {
    slug: "maasai-mara-great-migration-safari",
    name: "Maasai Mara Great Migration Safari",
    category: "safari",
    tagline: "Front-row seats to the greatest wildlife show on earth.",
    description:
      "Spend four unforgettable days in the Maasai Mara National Reserve, home to the Big Five and the dramatic Great Migration river crossings. Our expert Maasai guides know every corner of the reserve, taking you to the best predator sightings at dawn and golden-hour game drives across the open savannah. Evenings are spent under the stars at a comfortable tented camp with views over the Mara plains.",
    location: "Maasai Mara, Narok County",
    durationDays: 4,
    priceUsd: 1250,
    imageUrl: img(35717988),
    gallery: [img(35717988), img(27832452), img(24181855)],
    highlights: [
      "Big Five game drives with expert Maasai guides",
      "Great Migration river crossings (July – October)",
      "Optional sunrise hot-air balloon safari",
      "Authentic Maasai village cultural visit",
      "Sundowners overlooking the Mara plains",
    ],
    includes: [
      "3 nights luxury tented camp (full board)",
      "Park entry fees for the Maasai Mara",
      "4x4 Land Cruiser with pop-up roof",
      "Nairobi hotel pick-up and drop-off",
      "Bottled water and flying doctors cover",
    ],
    tripadvisorRating: 4.9,
    tripadvisorReviewCount: 312,
    tripadvisorUrl: ta("Maasai Mara Great Migration Safari Savanna & Shores Kenya"),
    tripadvisorAward: "Travellers' Choice 2025",
    featured: true,
    reviews: [
      {
        author: "Hannah W",
        authorLocation: "Manchester, United Kingdom",
        rating: 5,
        title: "Absolutely once in a lifetime",
        body: "We saw two river crossings on day two and a cheetah hunt on day three. Our guide Joseph spotted a leopard in a tree that nobody else on the track noticed. Paying by card online beforehand made everything seamless.",
        reviewedAt: "September 2025",
      },
      {
        author: "Mwangi K",
        authorLocation: "Nairobi, Kenya",
        rating: 5,
        title: "Best local safari operator, hands down",
        body: "Booked for my parents' anniversary and paid via M-Pesa in under a minute. The camp was beautiful and the team went above and beyond with a surprise bush dinner.",
        reviewedAt: "August 2025",
      },
      {
        author: "Lucas B",
        authorLocation: "Berlin, Germany",
        rating: 4,
        title: "Fantastic guiding, long drive from Nairobi",
        body: "The drive from Nairobi is long but the scenery over the Rift Valley made up for it. The Mara itself was spectacular and the tented camp very comfortable.",
        reviewedAt: "July 2025",
      },
    ],
  },
  {
    slug: "amboseli-kilimanjaro-elephant-safari",
    name: "Amboseli & Kilimanjaro Views Safari",
    category: "safari",
    tagline: "Giant tuskers against the backdrop of Africa's highest peak.",
    description:
      "Amboseli National Park is famous for its large-tusked elephant herds and postcard views of snow-capped Mount Kilimanjaro. Over three days you will explore the swamps, acacia woodlands and dusty plains where hundreds of elephants roam, climb Observation Hill for panoramic views, and enjoy game drives timed for the clearest mountain vistas at sunrise.",
    location: "Amboseli National Park, Kajiado County",
    durationDays: 3,
    priceUsd: 890,
    imageUrl: img(18960157),
    gallery: [img(18960157), img(19294855), img(20335122)],
    highlights: [
      "Famous elephant herds with 100lb+ tuskers",
      "Sunrise views of Mount Kilimanjaro",
      "Observation Hill panoramic walk",
      "Over 400 bird species in the swamps",
    ],
    includes: [
      "2 nights lodge accommodation (full board)",
      "Amboseli park entry fees",
      "Private 4x4 safari vehicle and driver-guide",
      "Nairobi hotel pick-up and drop-off",
    ],
    tripadvisorRating: 4.8,
    tripadvisorReviewCount: 198,
    tripadvisorUrl: ta("Amboseli Kilimanjaro Safari Savanna & Shores Kenya"),
    tripadvisorAward: null,
    featured: true,
    reviews: [
      {
        author: "Priya S",
        authorLocation: "Mumbai, India",
        rating: 5,
        title: "Kilimanjaro appeared just for us",
        body: "The clouds lifted on our second morning and the mountain was perfectly clear behind a herd of elephants. Our guide Daniel was incredibly knowledgeable about elephant behaviour.",
        reviewedAt: "October 2025",
      },
      {
        author: "Tom & Ellie R",
        authorLocation: "Sydney, Australia",
        rating: 5,
        title: "Great value, brilliant lodge",
        body: "Everything was organised to the minute. We loved that we could pay a deposit by Visa and settle the balance in Kenya. Highly recommend.",
        reviewedAt: "June 2025",
      },
    ],
  },
  {
    slug: "samburu-ol-pejeta-conservancy-safari",
    name: "Samburu & Ol Pejeta Conservancy Safari",
    category: "safari",
    tagline: "Rare northern species and the last northern white rhinos.",
    description:
      "Head north to the rugged, semi-arid beauty of Samburu National Reserve to find the 'Samburu Special Five' – Grevy's zebra, reticulated giraffe, Somali ostrich, gerenuk and beisa oryx. Continue to Ol Pejeta Conservancy on the Laikipia plateau, home to the world's last two northern white rhinos and a sanctuary for rescued chimpanzees, with Mount Kenya rising on the horizon.",
    location: "Samburu & Laikipia Counties",
    durationDays: 5,
    priceUsd: 1480,
    imageUrl: img(31055420),
    gallery: [img(31055420), img(5306140), img(20865860)],
    highlights: [
      "Samburu Special Five wildlife spotting",
      "Meet the last northern white rhinos at Ol Pejeta",
      "Sweetwaters Chimpanzee Sanctuary visit",
      "Ewaso Ng'iro river elephant herds",
      "Samburu cultural experience",
    ],
    includes: [
      "4 nights lodge & camp accommodation (full board)",
      "All conservancy and reserve entry fees",
      "Private 4x4 Land Cruiser with driver-guide",
      "Nairobi hotel pick-up and drop-off",
    ],
    tripadvisorRating: 4.7,
    tripadvisorReviewCount: 156,
    tripadvisorUrl: ta("Samburu Ol Pejeta Safari Savanna & Shores Kenya"),
    tripadvisorAward: null,
    featured: false,
    reviews: [
      {
        author: "Grace O",
        authorLocation: "Kampala, Uganda",
        rating: 5,
        title: "Emotional and unforgettable",
        body: "Seeing Najin and Fatu, the last two northern white rhinos, was deeply moving. Samburu was wild and uncrowded compared to the Mara. Our guide Lekishon was outstanding.",
        reviewedAt: "September 2025",
      },
      {
        author: "Mark D",
        authorLocation: "Toronto, Canada",
        rating: 4,
        title: "Off the beaten track gem",
        body: "Far fewer vehicles than the southern parks. Lodge Wi-Fi was patchy but who needs it with leopards visiting the riverbank at night.",
        reviewedAt: "May 2025",
      },
    ],
  },
  {
    slug: "tsavo-east-west-classic-safari",
    name: "Tsavo East & West Classic Safari",
    category: "safari",
    tagline: "Red elephants, lava flows and crystal-clear Mzima Springs.",
    description:
      "Kenya's largest protected area, Tsavo is famed for its red-dust-bathed elephants, the legendary man-eaters of the Yatta plateau, and the dramatic Shetani lava flows. Watch hippos and crocodiles through the underwater viewing chamber at Mzima Springs and enjoy classic Kenyan safari game drives across vast, uncrowded wilderness – ideal as an add-on to a coastal beach holiday.",
    location: "Tsavo National Parks, Taita-Taveta County",
    durationDays: 3,
    priceUsd: 760,
    imageUrl: img(24181855),
    gallery: [img(24181855), img(20335122), img(5306128)],
    highlights: [
      "Tsavo's iconic red elephants",
      "Mzima Springs underwater hippo viewing",
      "Shetani lava flows and Chaimu crater",
      "Perfect safari + beach combination from Mombasa",
    ],
    includes: [
      "2 nights safari lodge accommodation (full board)",
      "Tsavo East & West park fees",
      "Safari vehicle with pop-up roof",
      "Mombasa or Diani hotel pick-up and drop-off",
    ],
    tripadvisorRating: 4.6,
    tripadvisorReviewCount: 143,
    tripadvisorUrl: ta("Tsavo East West Safari Savanna & Shores Kenya"),
    tripadvisorAward: null,
    featured: false,
    reviews: [
      {
        author: "Sofia M",
        authorLocation: "Milan, Italy",
        rating: 5,
        title: "Perfect break from the beach",
        body: "We were picked up from our Diani hotel and within hours were watching red elephants at a waterhole. The night at the lodge overlooking the floodlit waterhole was magical.",
        reviewedAt: "August 2025",
      },
      {
        author: "James A",
        authorLocation: "Mombasa, Kenya",
        rating: 4,
        title: "Great weekend safari",
        body: "Booked on Thursday, paid with M-Pesa, and were on safari Saturday morning. Very responsive team on WhatsApp.",
        reviewedAt: "April 2025",
      },
    ],
  },
  {
    slug: "diani-beach-escape",
    name: "Diani Beach Escape",
    category: "beach",
    tagline: "Africa's leading beach destination, powder-white and palm-fringed.",
    description:
      "Diani Beach has been voted Africa's Leading Beach Destination for years running, and it is easy to see why: 17 kilometres of powder-white sand, warm turquoise Indian Ocean water protected by a coral reef, and swaying coconut palms. Stay at a boutique beachfront resort, snorkel the reef, kitesurf at Galu, and dine on fresh seafood as dhows sail past at sunset.",
    location: "Diani Beach, Kwale County",
    durationDays: 5,
    priceUsd: 980,
    imageUrl: img(20693411),
    gallery: [img(20693411), img(4604439), img(38376805)],
    highlights: [
      "Beachfront boutique resort on Diani's best stretch",
      "Snorkelling trip to Kisite-Mpunguti Marine Park",
      "Sunset dhow cruise with seafood dinner",
      "Colobus monkey conservation walk",
      "Optional kitesurfing and skydiving",
    ],
    includes: [
      "4 nights beachfront resort (half board)",
      "Return Mombasa airport transfers via Likoni ferry or Dongo Kundu bypass",
      "Kisite-Mpunguti snorkelling excursion with lunch",
      "Sunset dhow cruise",
    ],
    tripadvisorRating: 4.9,
    tripadvisorReviewCount: 274,
    tripadvisorUrl: ta("Diani Beach Escape Savanna & Shores Kenya"),
    tripadvisorAward: "Travellers' Choice 2025",
    featured: true,
    reviews: [
      {
        author: "Olivia P",
        authorLocation: "London, United Kingdom",
        rating: 5,
        title: "The most beautiful beach I have ever seen",
        body: "The sand really is that white. The snorkelling at Kisite was incredible – we swam with dolphins on the way out. Booking online with Visa was quick and the confirmation arrived instantly.",
        reviewedAt: "October 2025",
      },
      {
        author: "Brian & Wanjiru N",
        authorLocation: "Nakuru, Kenya",
        rating: 5,
        title: "Perfect honeymoon",
        body: "They arranged a private candlelit dinner on the beach for us. Paid a deposit with M-Pesa and the balance on arrival. Superb service throughout.",
        reviewedAt: "September 2025",
      },
      {
        author: "Anders L",
        authorLocation: "Copenhagen, Denmark",
        rating: 4,
        title: "Relaxing and well organised",
        body: "Transfers were punctual and the resort was lovely. Beach vendors can be persistent but the resort's own beach section was quiet.",
        reviewedAt: "February 2025",
      },
    ],
  },
  {
    slug: "watamu-malindi-marine-getaway",
    name: "Watamu & Malindi Marine Getaway",
    category: "beach",
    tagline: "Turtles, coral gardens and Swahili history on the north coast.",
    description:
      "Watamu Marine National Park protects some of the finest coral gardens on the East African coast. Snorkel among parrotfish and turtles, kayak through the mangroves of Mida Creek at sunset, explore the haunting 13th-century Gede Ruins, and visit the Local Ocean Conservation turtle rehabilitation centre. Nearby Malindi adds Italian-influenced dining and the Vasco da Gama pillar.",
    location: "Watamu, Kilifi County",
    durationDays: 4,
    priceUsd: 840,
    imageUrl: img(4604439),
    gallery: [img(4604439), img(30312987), img(13869436)],
    highlights: [
      "Snorkelling in Watamu Marine National Park",
      "Mida Creek sunset kayak or dhow trip",
      "Gede Ruins guided historical tour",
      "Turtle rehabilitation centre visit",
    ],
    includes: [
      "3 nights boutique beach hotel (bed & breakfast)",
      "Return Malindi or Mombasa airport transfers",
      "Marine park entry and glass-bottom boat trip",
      "Gede Ruins entry and guide",
    ],
    tripadvisorRating: 4.8,
    tripadvisorReviewCount: 167,
    tripadvisorUrl: ta("Watamu Malindi Getaway Savanna & Shores Kenya"),
    tripadvisorAward: null,
    featured: false,
    reviews: [
      {
        author: "Chloé D",
        authorLocation: "Lyon, France",
        rating: 5,
        title: "Swam with three turtles!",
        body: "The coral gardens were teeming with life and the team at the turtle centre were inspiring. Watamu is quieter than Diani and we loved it.",
        reviewedAt: "August 2025",
      },
      {
        author: "Kevin O",
        authorLocation: "Kisumu, Kenya",
        rating: 5,
        title: "Effortless booking",
        body: "Paid via M-Pesa STK push, got my receipt on the confirmation page immediately. The Mida Creek sunset was the highlight.",
        reviewedAt: "July 2025",
      },
    ],
  },
  {
    slug: "lamu-island-heritage-retreat",
    name: "Lamu Island Heritage Retreat",
    category: "beach",
    tagline: "A UNESCO World Heritage island where time slows to a donkey's pace.",
    description:
      "Lamu Old Town is the oldest and best-preserved Swahili settlement in East Africa, a UNESCO World Heritage Site of coral-stone houses, carved wooden doors and narrow car-free lanes. Stay in a restored Swahili house in Shela village, sail on a traditional dhow to secluded sandbanks, and watch the sunset from the rooftop as the call to prayer drifts across the channel.",
    location: "Lamu Archipelago, Lamu County",
    durationDays: 4,
    priceUsd: 1120,
    imageUrl: img(27742235),
    gallery: [img(27742235), img(20693413), img(11340076)],
    highlights: [
      "Restored Swahili house in Shela village",
      "Full-day dhow sailing with Swahili seafood lunch",
      "Guided walk through Lamu Old Town and Lamu Museum",
      "12km deserted Shela beach and sand dunes",
    ],
    includes: [
      "3 nights Swahili house accommodation (bed & breakfast)",
      "Return domestic flights Nairobi – Lamu (Manda)",
      "Boat transfers from Manda airstrip",
      "Dhow sailing day trip with lunch",
    ],
    tripadvisorRating: 4.9,
    tripadvisorReviewCount: 203,
    tripadvisorUrl: ta("Lamu Island Retreat Savanna & Shores Kenya"),
    tripadvisorAward: "Travellers' Choice 2025",
    featured: true,
    reviews: [
      {
        author: "Isabel F",
        authorLocation: "Lisbon, Portugal",
        rating: 5,
        title: "Pure magic",
        body: "Lamu is unlike anywhere else. The house had a rooftop with views across to Manda, and the dhow captain cooked the best fish of our lives on a sandbank.",
        reviewedAt: "September 2025",
      },
      {
        author: "Nadia H",
        authorLocation: "Dubai, UAE",
        rating: 5,
        title: "Seamless from booking to departure",
        body: "Flights, boats and house all synced perfectly. Paid with Mastercard online and the WhatsApp support line answered every question within minutes.",
        reviewedAt: "June 2025",
      },
    ],
  },
  {
    slug: "mombasa-north-coast-family-holiday",
    name: "Mombasa North Coast Family Holiday",
    category: "beach",
    tagline: "All-inclusive fun for the whole family on Nyali and Bamburi beaches.",
    description:
      "The North Coast of Mombasa is made for families: all-inclusive resorts with kids' clubs and water slides, calm reef-protected beaches at Nyali and Bamburi, and a full menu of activities from Haller Park's giraffes and giant tortoises to Fort Jesus and a Mombasa Old Town tuk-tuk tour. Evenings bring Swahili buffets and acrobat shows under the palms.",
    location: "Nyali & Bamburi, Mombasa County",
    durationDays: 5,
    priceUsd: 760,
    imageUrl: img(6129358),
    gallery: [img(6129358), img(1591379), img(20693411)],
    highlights: [
      "All-inclusive family resort with kids' club and pools",
      "Haller Park giraffe feeding",
      "Fort Jesus and Old Town tuk-tuk tour",
      "Glass-bottom boat trip to Mombasa Marine Park",
    ],
    includes: [
      "4 nights all-inclusive resort accommodation",
      "Return Moi International Airport transfers",
      "Haller Park and Fort Jesus entry fees",
      "Half-day Mombasa city tour",
    ],
    tripadvisorRating: 4.6,
    tripadvisorReviewCount: 189,
    tripadvisorUrl: ta("Mombasa North Coast Family Holiday Savanna & Shores Kenya"),
    tripadvisorAward: null,
    featured: false,
    reviews: [
      {
        author: "The Otieno Family",
        authorLocation: "Eldoret, Kenya",
        rating: 5,
        title: "Kids are still talking about it",
        body: "Giraffe feeding at Haller Park and the water slides at the resort were the winners. We paid in instalments – deposit by M-Pesa, balance by Visa – no hassle at all.",
        reviewedAt: "August 2025",
      },
      {
        author: "Sarah J",
        authorLocation: "Bristol, United Kingdom",
        rating: 4,
        title: "Great value family week",
        body: "Resort food was plentiful and the beach calm enough for our toddlers. The city tour was hot but Fort Jesus was fascinating.",
        reviewedAt: "April 2025",
      },
    ],
  },
];

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [{ value }] = await db.select({ value: count() }).from(listings);
      if (Number(value) > 0) return;

      for (const item of seedListings) {
        const { reviews: itemReviews, ...listingValues } = item;
        const [inserted] = await db
          .insert(listings)
          .values(listingValues)
          .onConflictDoNothing()
          .returning({ id: listings.id });
        if (!inserted) continue;
        await db.insert(reviews).values(
          itemReviews.map((r) => ({ ...r, listingId: inserted.id, source: "tripadvisor" })),
        );
      }
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
