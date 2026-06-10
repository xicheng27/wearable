import { redirect } from "next/navigation";

interface LegacyCategoryPageProps {
  params: { id: string };
}

const categoryRedirects: Record<string, string> = {
  tops: "/categories/tops",
  shirts: "/categories/shirts",
  tshirts: "/search?clothing=Tops",
  pants: "/categories/pants",
  jeans: "/categories/jeans",
  shoes: "/categories/shoes",
  underwear: "/categories/underwear",
  dresses: "/categories/dresses",
  jackets: "/categories/jackets",
  formal: "/categories/formalwear",
  activewear: "/search?style=Sporty",
  nightwear: "/search?style=Comfort",
};

export default function LegacyCategoryPage({
  params,
}: LegacyCategoryPageProps) {
  redirect(categoryRedirects[params.id] ?? "/search");
}
