/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shoptommy.scene7.com",
      },
      {
        protocol: "https",
        hostname: "izadaptive.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "billyfootwear.com",
      },
      {
        protocol: "https",
        hostname: "magnaready.com",
      },
      {
        protocol: "https",
        hostname: "slickchicksonline.com",
      },
      {
        protocol: "https",
        hostname: "static.nike.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
