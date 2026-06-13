export interface Review {
  id: string;
  productId: string;
  author: string;
  /** 1–5 stars. */
  rating: number;
  text: string;
  /** ISO date string. */
  date: string;
}

/**
 * Seed reviews shown alongside any a visitor leaves in their browser.
 * These are illustrative community-style notes, not scraped customer
 * reviews — they give the feedback section life before real reviews exist.
 */
export const seedReviews: Review[] = [
  {
    id: "r-iz-jeans-1",
    productId: "iz-seated-jeans",
    author: "Marcus T.",
    rating: 5,
    text: "First jeans in years that don't bunch at my lower back in the chair. No pressure point at all — genuinely comfortable for a full day.",
    date: "2026-04-18",
  },
  {
    id: "r-iz-jeans-2",
    productId: "iz-seated-jeans",
    author: "Priya (OT)",
    rating: 4,
    text: "I recommend these to clients with SCI. Sizing runs slightly long, but the seamless back is exactly as described.",
    date: "2026-05-02",
  },
  {
    id: "r-tommy-polo-1",
    productId: "tommy-magnetic-polo",
    author: "Dawn R.",
    rating: 5,
    text: "Bought it for my dad after his stroke. He can dress the top half on his own again — the magnets just snap shut. Huge for his confidence.",
    date: "2026-03-29",
  },
  {
    id: "r-billy-1",
    productId: "billy-zip-hightops",
    author: "Jordan",
    rating: 5,
    text: "The zip-around really does fold the whole shoe open. Works with my AFO without a fight. Looks like normal sneakers too.",
    date: "2026-05-11",
  },
  {
    id: "r-flyease-1",
    productId: "zappos-nike-flyease",
    author: "Sam K.",
    rating: 4,
    text: "Hands-free entry is the real deal. Took a couple tries to learn the heel motion but now it's effortless.",
    date: "2026-04-06",
  },
  {
    id: "r-magnaready-1",
    productId: "magnaready-dress-shirt",
    author: "Elaine",
    rating: 5,
    text: "Looks like a normal dress shirt — nobody can tell. My husband with Parkinson's dresses himself for work again.",
    date: "2026-02-20",
  },
  {
    id: "r-slick-1",
    productId: "slick-chicks-underwear",
    author: "Anonymous",
    rating: 4,
    text: "Side fastenings make such a difference post-surgery. Comfortable and discreet under clothes.",
    date: "2026-05-19",
  },
  {
    id: "r-will-well-1",
    productId: "will-well-magnetic-shirt",
    author: "Wei Ling",
    rating: 5,
    text: "Light enough for Singapore weather and the MagSnap buttons are so satisfying. Wish they made more colours.",
    date: "2026-05-25",
  },
];

export function getSeedReviews(productId: string): Review[] {
  return seedReviews.filter((r) => r.productId === productId);
}
