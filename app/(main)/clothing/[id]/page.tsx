import { notFound } from "next/navigation";
import { clothingCategories, getCategoryById } from "@/data/categories";
import CategoryClient from "./CategoryClient";

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return clothingCategories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const category = getCategoryById(params.id);
  if (!category) return {};
  return {
    title: `${category.name} – Xi's`,
    description: category.description,
  };
}

export default function ClothingCategoryPage({ params }: PageProps) {
  const category = getCategoryById(params.id);
  if (!category) notFound();

  return <CategoryClient categoryId={category.id} />;
}
