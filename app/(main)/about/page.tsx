import Link from "next/link";

export const metadata = {
  title: "About – Xi's",
  description:
    "Xi's is an adaptive fashion directory helping elderly users, caregivers and people with disabilities find clothing that genuinely fits their needs.",
};

const canDo = [
  {
    title: "Browse real adaptive clothing",
    body: "Individual items from adaptive brands worldwide — magnetic shirts, seated-fit pants, open-back dresses, easy-entry shoes — each linking to the brand's own product page.",
    href: "/search",
    cta: "Browse Clothing",
  },
  {
    title: "Find clothing by need",
    body: "Answer a few friendly questions about your accessibility needs, comfort and style, and we'll match you with items that genuinely fit.",
    href: "/quiz",
    cta: "Find by Need",
  },
  {
    title: "Explore trusted brands",
    body: "Read about each adaptive label — who it suits, its adaptive features, shipping and returns, and where to find it in person.",
    href: "/brands",
    cta: "See Brands",
  },
  {
    title: "Find stores near you",
    body: "Flagship stores, stockists and adaptive alteration services, mapped with their accessibility focus.",
    href: "/map",
    cta: "Open the Map",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          About Xi&apos;s
        </h1>
        <p
          className="animate-fade-up mt-6 text-lg leading-relaxed text-gray-700 sm:text-xl"
          style={{ animationDelay: "80ms" }}
        >
          Xi&apos;s is an adaptive fashion directory made for elderly users,
          caregivers, and people with disabilities. Ordinary clothing assumes
          steady hands, full reach and standing dressing — adaptive clothing
          doesn&apos;t. We gather real adaptive clothing items from trusted
          brands around the world into one simple, readable place, so finding
          clothes that work for your body takes minutes, not weeks.
        </p>

        <h2 className="mt-14 text-2xl font-bold tracking-tight text-gray-900">
          What you can do here
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {canDo.map((item) => (
            <div key={item.title} className="card flex flex-col p-6">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-gray-600">{item.body}</p>
              <Link href={item.href} className="btn-secondary mt-5 px-5 py-2.5 text-base">
                {item.cta}
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold tracking-tight text-gray-900">
          Where our information comes from
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Every product in our catalogue was researched from the brand&apos;s
          official website, and &ldquo;View product&rdquo; buttons link to the
          brand&apos;s own product pages wherever we could verify them. We show
          prices and shipping details only when the brand publishes them, and
          we say so clearly when information is limited rather than guessing.
          We don&apos;t sell anything ourselves — purchases happen directly
          with each brand.
        </p>

        <h2 className="mt-14 text-2xl font-bold tracking-tight text-gray-900">
          Our accessibility commitment
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          This site is built to be readable and usable for everyone: large
          text and buttons, strong colour contrast, keyboard-friendly
          navigation, clearly labelled controls, and calm pages without
          flashing or busy animation. If anything on this site is hard for you
          to read or use, we genuinely want to know so we can fix it.
        </p>

        <div className="mt-12 rounded-2xl bg-primary-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">Ready to start?</h2>
          <p className="mt-2 text-lg text-gray-700">
            Browse the full catalogue, or answer a few questions and let us
            match clothing to your needs.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/search" className="btn-primary">
              Browse Clothing
            </Link>
            <Link href="/quiz" className="btn-secondary">
              Find by Need
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
