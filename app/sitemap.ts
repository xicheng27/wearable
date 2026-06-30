import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { products, productCategories } from "@/data/products";
import { brands } from "@/data/brands";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/quiz", priority: 0.9, changeFrequency: "monthly" },
    { path: "/search", priority: 0.9, changeFrequency: "daily" },
    { path: "/singapore", priority: 0.8, changeFrequency: "weekly" },
    { path: "/map", priority: 0.7, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" },
    { path: "/saved", priority: 0.4, changeFrequency: "monthly" },
    { path: "/submit", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
    { path: "/accessibility", priority: 0.5, changeFrequency: "yearly" },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const base: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = productCategories.map((category) => ({
    url: `${siteConfig.url}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${siteConfig.url}/brands/${brand.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...base, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
