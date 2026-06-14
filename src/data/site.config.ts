// ===================================================================
//  SITE CONFIGURATION — Single source of truth
//  To reuse this template for a new project, edit ONLY this file
//  and src/data/content/*.ts + src/styles/theme.css
// ===================================================================

export const SITE = {
  // ── Site Identity ──────────────────────────────────────────────
  name: "Skiathos Fish Market",
  shortName: "Fish Market",
  tagline: "Fresh Aegean Seafood",
  description:
    "Fish market in Skiathos Town. Fresh Aegean seafood, professional fishmonger services, wholesale distribution, and yacht provisioning.",
  url: "https://fishmarketskiathos.gr",
  language: "en",
  locale: "en_US",

  // ── Google Search Console ──────────────────────────────────────
  googleVerification: "VfO55iIQf4xzliNyKizYubJTMTDhwlf6Fthz-N7oliA",

  // ── Business ───────────────────────────────────────────────────
  business: {
    legalName: "Skiathos Fish Market - Giorgos Tsiantos",
    alternateName:
      "Ιχθυοπωλείο - Fishmarket 'Σκιάθος' Γιώργος Τσιαντός",
    yearEstablished: 2004,
    priceRange: "€€",
    languages: ["English", "Greek", "Italian"] as const,

    address: {
      street: "48 Ethnikis Antistaseos",
      locality: "Skiathos Town",
      region: "Magnisia",
      postalCode: "37002",
      country: "GR",
      countryName: "Greece",
    },

    geo: {
      latitude: "39.1625",
      longitude: "23.4892",
    },

    contact: {
      phone: { display: "693 115 6528", raw: "+306931156528" },
      email: "skiathosfishmarket@gmail.com",
      whatsappUrl: "https://wa.me/306931156528",
    },

    hours: {
      display: "24/7, Always Open",
      shortDisplay: "24/7 Always Open",
      schema: "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59",
    },

    social: {
      facebook: "https://www.facebook.com/fishmarketskiathos",
      instagram: "https://www.instagram.com/fishmarketskiathos/",
      twitter: "@fishmarketskiathos",
    },

    serviceAreas: ["Skiathos", "Skopelos", "Alonissos"] as const,
  },

  // ── SEO Defaults ───────────────────────────────────────────────
  seo: {
    // Default page title suffix
    titleSuffix: " | Skiathos Fish Market",
    // Default description if a page doesn't provide one
    defaultDescription:
      "Fish market in Skiathos Town. Fresh Aegean seafood, professional fishmonger services, wholesale distribution, and yacht provisioning.",
    // Default OG image (used when a page doesn't specify one)
    defaultOGImage:
      "https://fishmarketskiathos.gr/images/skiathos-hero-home.webp",
    ogImageAlt: "Fresh Aegean seafood at Skiathos Fish Market",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterHandle: "@fishmarketskiathos",
    themeColor: "#4A7F9D",
    author: "Skiathos Fish Market - Giorgos Tsiantos",
  },

  // ── Navigation ─────────────────────────────────────────────────
  nav: {
    main: [
      { label: "Home", href: "/" },
      { label: "Fresh Seafood", href: "/fresh-seafood" },
      { label: "Traditional", href: "/traditional-seasonal" },
      { label: "Wholesale & Yachts", href: "/wholesale-yachts" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ] as const,
    footer: [
      { label: "Home", href: "/" },
      { label: "Fresh Seafood", href: "/fresh-seafood" },
      { label: "Traditional & Seasonal", href: "/traditional-seasonal" },
      { label: "Wholesale & Yachts", href: "/wholesale-yachts" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ] as const,
  },

  // ── Hero Image (homepage) ──────────────────────────────────────
  heroImage: "/images/skiathos-hero-home.webp",

  // ── Logo & Favicon ─────────────────────────────────────────────
  logoPath: "/fishmarket-logo-v2.svg",

  // ── Google Rating ──────────────────────────────────────────────
  rating: {
    value: "5.0",
    best: "5",
    count: 8,
  },

  // ── Reviews (used for LocalBusiness schema) ────────────────────
  reviews: [
    {
      author: "Ilias K.",
      body: "The freshest fish and seafood swim here!!",
      rating: 5,
    },
    {
      author: "agelos katsouras",
      body: "Local Fresh fish and seafood, and good prices",
      rating: 5,
    },
    {
      author: "Stamatis Valtas",
      body: "The best fish shop in Skiathos with lots of fish and all fresh local.",
      rating: 5,
    },
    {
      author: "Steve",
      body: "Great place for fresh fish, opens around 9am. One morning the fish didn't arrive until after 10am. Today, 21/09/23, two good size sea bream 10 euros. They will clean the fish on request.",
      rating: 5,
    },
    {
      author: "Mauro Cestra",
      body: "The only good fishmonger on the island. The fish doesn't arrive until 10:30, but they have a little bit of everything. Everything runs out by 1:00 PM at the latest, so hurry up and buy!",
      rating: 5,
    },
    {
      author: "francesca caputo",
      body: "We didn't spend much time in Skiathos, but the fish we bought here was incredibly fresh and delicious. Highly recommended!",
      rating: 5,
    },
    {
      author: "Riccardo Bardine",
      body: "We arrived at the last minute and found some incredibly fresh and exceptional prawns, at a fraction of the price in other countries. The quality is truly excellent. A very pleasant surprise!",
      rating: 5,
    },
    {
      author: "ambra Parrini",
      body: "Simply unique. The owner speaks Italian, and his fish is so fresh you'll feel like you're eating among the waves. Very fair prices.",
      rating: 5,
    },
  ],

  // ── Map Embeds ─────────────────────────────────────────────────
  maps: {
    // OpenStreetMap iframe URL (used on homepage)
    openStreetMap:
      "https://www.openstreetmap.org/export/embed.html?bbox=23.3%2C39.0%2C24.0%2C39.35&layer=mapnik&marker=39.1625%2C23.4892",
    // Google Maps iframe URL (used on contact page)
    googleMaps:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3093.540569975178!2d23.482568677272546!3d39.162430031020506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a76c656d3f2675%3A0xd1d0834f3466fabb!2sfishmarketskiathos!5e0!3m2!1sen!2sgr!4v1780686523673!5m2!1sen!2sgr",
  },

  // ── PWA Manifest ───────────────────────────────────────────────
  manifest: {
    backgroundColor: "#ffffff",
    display: "standalone" as const,
  },
} as const;

// ── Helper: generate LocalBusiness JSON-LD schema ────────────────
export function generateBusinessSchema() {
  const { business, url, rating, reviews } = SITE;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.legalName,
    alternateName: business.alternateName,
    image: SITE.heroImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    url,
    telephone: business.contact.phone.raw,
    email: business.contact.email,
    priceRange: business.priceRange,
    openingHours: business.hours.schema,
    award: ["Trusted by our customers"],
    description: SITE.description,
    areaServed: {
      "@type": "City",
      name: "Skiathos",
    },
    sameAs: [business.social.facebook, business.social.instagram],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      bestRating: rating.best,
      ratingCount: rating.count,
      reviewCount: rating.count,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: rating.best,
      },
    })),
  };
}

// ── Helper: generate WebSite JSON-LD schema ──────────────────────
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/faq/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ── Helper: generate ContactPoint JSON-LD schema ─────────────────
export function generateContactSchema() {
  const { business } = SITE;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.legalName,
    telephone: business.contact.phone.raw,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.contact.phone.raw,
      contactType: "customer service",
      contactOption: ["TollFree", "WhatsApp"],
      areaServed: ["GR", ...business.serviceAreas],
      availableLanguage: business.languages,
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };
}

// ── Helper: generate BreadcrumbList JSON-LD ──────────────────────
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

// ── Helper: build canonical URL ──────────────────────────────────
export function canonicalUrl(path: string): string {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return normalized === "/" ? `${SITE.url}/` : `${SITE.url}${normalized}`;
}
