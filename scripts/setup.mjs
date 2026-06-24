#!/usr/bin/env node

/**
 * Project Setup Wizard
 * =====================
 * Interactive CLI that collects business info and generates:
 *   - src/data/site.config.ts   (business config + SEO)
 *   - src/data/content/*.ts     (services, testimonials, faq, gallery)
 *
 * Usage:
 *   node scripts/setup.mjs              Interactive mode
 *   node scripts/setup.mjs --help       Show help
 */

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// ── Helpers ──────────────────────────────────────────────────────

function ask(rl, question, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  return rl.question(`${question}${suffix}: `).then((answer) => answer.trim() || defaultValue);
}

function askYesNo(rl, question, defaultValue = 'y') {
  const prompt = defaultValue === 'y' ? 'Y/n' : 'y/N';
  return rl.question(`${question} (${prompt}): `).then((answer) => {
    const a = answer.trim().toLowerCase();
    if (!a) return defaultValue === 'y';
    return a === 'y' || a === 'yes';
  });
}

function askList(rl, question, doneWord = 'done') {
  const items = [];
  return (function loop() {
    return rl.question(`${question} (type "${doneWord}" to finish): `).then((answer) => {
      const a = answer.trim();
      if (!a || a.toLowerCase() === doneWord) return items;
      items.push(a);
      return loop();
    });
  })();
}

function askServiceList(rl) {
  const services = [];
  console.log('\n── Enter your services/products (one per line, blank when done) ──');
  return (function loop() {
    return rl.question('  Service name: ').then((name) => {
      const n = name.trim();
      if (!n) return services;
      return rl.question('  Description: ').then((desc) => {
        services.push({ name: n, description: desc.trim() || `Description for ${n}`, position: services.length + 1 });
        return loop();
      });
    });
  })();
}

function askFaqList(rl) {
  const faqs = [];
  console.log('\n── Enter FAQ items (blank question when done) ──');
  return (function loop() {
    return rl.question('  Question: ').then((q) => {
      const question = q.trim();
      if (!question) return faqs;
      return rl.question('  Answer: ').then((a) => {
        faqs.push({ q: question, a: a.trim() || 'Add your answer here.' });
        return loop();
      });
    });
  })();
}

function askReviews(rl) {
  console.log('\n── Reviews / Testimonials ──');
  console.log('  You can provide:');
  console.log('  1. A Google Maps or TripAdvisor link (agent will fetch)');
  console.log('  2. Manual reviews (one at a time)');
  console.log('  3. Skip (use placeholders)');

  return rl.question('  Enter a review URL, a manual review, or "skip": ').then((answer) => {
    const a = answer.trim();
    if (!a || a.toLowerCase() === 'skip') return Promise.resolve([]);

    // Check if it looks like a URL
    if (a.startsWith('http://') || a.startsWith('https://')) {
      console.log(`  → Review URL recorded: ${a}`);
      console.log('  → The AI agent should fetch this and parse the reviews.');
      console.log('  → For now, continuing with placeholder reviews.');
      return Promise.resolve([]);
    }

    // Manual review entry
    const reviews = [];
    // If they typed a quote, start with it
    if (a.length > 5) {
      return rl.question('  Reviewer name: ').then((name) => {
        return rl.question('  Rating (1-5): ').then((rating) => {
          reviews.push({
            quote: a,
            name: name.trim() || 'Customer',
            rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
          });
          return askMoreReviews(rl, reviews);
        });
      });
    }
    return Promise.resolve([]);
  });
}

function askMoreReviews(rl, reviews) {
  return rl.question('  Add another review? (y/N): ').then((answer) => {
    if (answer.trim().toLowerCase() !== 'y') return reviews;
    return rl.question('  Review quote: ').then((quote) => {
      if (!quote.trim()) return reviews;
      return rl.question('  Reviewer name: ').then((name) => {
        return rl.question('  Rating (1-5): ').then((rating) => {
          reviews.push({
            quote: quote.trim(),
            name: name.trim() || 'Customer',
            rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
          });
          return askMoreReviews(rl, reviews);
        });
      });
    });
  });
}

function validateHex(color) {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

function hexToTailwindShades(hex) {
  // Simple luminance-based shade generation
  // Takes a brand hex and returns 10 shades (50-950)
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Simple algorithm: mix with white for light, black for dark
  const shade = (amount) => {
    const mix = (c, m) => Math.round(c + (m - c) * amount);
    // amount: 0 = original, -1 = white, 1 = black
    if (amount < 0) {
      const t = -amount;
      return `oklch(from ${hex} ${100 - t * 40}% c h)`;
    }
    if (amount > 0) {
      const t = amount;
      return `oklch(from ${hex} ${100 - t * 60}% c h)`;
    }
    return hex;
  };

  return {
    '50': `color-mix(in srgb, ${hex} 5%, white)`,
    '100': `color-mix(in srgb, ${hex} 10%, white)`,
    '200': `color-mix(in srgb, ${hex} 25%, white)`,
    '300': `color-mix(in srgb, ${hex} 45%, white)`,
    '400': `color-mix(in srgb, ${hex} 70%, white)`,
    '500': hex,
    '600': `color-mix(in srgb, ${hex} 80%, black)`,
    '700': `color-mix(in srgb, ${hex} 65%, black)`,
    '800': `color-mix(in srgb, ${hex} 50%, black)`,
    '900': `color-mix(in srgb, ${hex} 35%, black)`,
    '950': `color-mix(in srgb, ${hex} 20%, black)`,
  };
}

// ── File Writers ──────────────────────────────────────────────────

function writeSiteConfig(data) {
  const shades = hexToTailwindShades(data.brandColor);
  const languages = data.language === 'el'
    ? `[\n    { code: "el", label: "Ελληνικά", locale: "el_GR" },\n    { code: "en", label: "English", locale: "en_US" },\n  ]`
    : `[\n    { code: "en", label: "English", locale: "en_US" },\n  ]`;

  const trustSignals = JSON.stringify(data.trustSignals, null, 4)
    .split('\n')
    .map((l, i) => i === 0 ? l : `    ${l}`)
    .join('\n');

  const out = `// ===================================================================
//  SITE CONFIGURATION — Auto-generated by scripts/setup.mjs
//  Edit this file to update your website data at any time.
// ===================================================================

export interface Language {
  code: string;
  label: string;
  locale: string;
  dir?: 'ltr' | 'rtl';
}

export const SITE = {
  name: ${JSON.stringify(data.name)},
  shortName: ${JSON.stringify(data.shortName)},
  tagline: ${JSON.stringify(data.tagline)},
  description: ${JSON.stringify(data.description)},
  url: ${JSON.stringify(data.url)},
  language: ${JSON.stringify(data.language)},
  locale: ${JSON.stringify(data.language === 'el' ? 'el_GR' : 'en_US')},

  languages: ${languages} as Language[],

  googleVerification: "YOUR_VERIFICATION_CODE",

  blog: {
    title: "Blog",
    description: "Latest news, articles, and updates.",
    path: "/blog",
    postsPerPage: 9,
  },

  business: {
    legalName: ${JSON.stringify(data.legalName)},
    alternateName: ${JSON.stringify(data.alternateName)},
    yearEstablished: ${data.yearEstablished},
    priceRange: ${JSON.stringify(data.priceRange)},
    languages: ${JSON.stringify(data.language === 'el' ? ['Ελληνικά', 'English'] : ['English'])} as const,

    address: {
      street: ${JSON.stringify(data.address.street)},
      locality: ${JSON.stringify(data.address.locality)},
      region: ${JSON.stringify(data.address.region)},
      postalCode: ${JSON.stringify(data.address.postalCode)},
      country: ${JSON.stringify(data.address.country)},
      countryName: ${JSON.stringify(data.address.countryName)},
    },

    geo: {
      latitude: ${JSON.stringify(data.geo.latitude)},
      longitude: ${JSON.stringify(data.geo.longitude)},
    },

    contact: {
      phone: { display: ${JSON.stringify(data.phone.display)}, raw: ${JSON.stringify(data.phone.raw)} },
      email: ${JSON.stringify(data.email)},
      whatsappUrl: ${JSON.stringify(data.whatsappUrl)},
    },

    hours: {
      display: ${JSON.stringify(data.hours.display)},
      shortDisplay: ${JSON.stringify(data.hours.shortDisplay)},
      schema: ${JSON.stringify(data.hours.schema)},
    },

    trustSignals: ${trustSignals},

    social: {
      facebook: ${JSON.stringify(data.social.facebook)},
      instagram: ${JSON.stringify(data.social.instagram)},
      twitter: ${JSON.stringify(data.social.twitter)},
    },

    serviceAreas: ${JSON.stringify(data.serviceAreas)} as const,
  },

  seo: {
    titleSuffix: ${JSON.stringify(` | ${data.name}`)},
    defaultDescription: ${JSON.stringify(data.description)},
    defaultOGImage: ${JSON.stringify(`${data.url}/images/placeholder.svg`)},
    ogImageAlt: ${JSON.stringify(data.name)},
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterHandle: ${JSON.stringify(data.social.twitter)},
    themeColor: ${JSON.stringify(data.brandColor)},
    author: ${JSON.stringify(data.name)},
  },

  nav: {
    main: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ] as const,
    footer: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ] as const,
  },

  heroImage: ${JSON.stringify(data.heroImage || '/images/placeholder.svg')},
  logoPath: ${JSON.stringify(data.logoPath || '/logo.svg')},

  rating: {
    value: ${JSON.stringify(data.rating?.value || '5.0')},
    best: "5",
    count: ${data.rating?.count || 0},
  },

  reviews: ${JSON.stringify(data.reviews || [])},

  maps: {
    openStreetMap:
      "https://www.openstreetmap.org/export/embed.html?bbox=23.6%2C37.8%2C23.9%2C38.1&layer=mapnik",
    googleMaps:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.941197503706!2d23.72503437686618!3d37.97863137195051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd06239ecb9d%3A0x400bd2ce4738850!2sAthens!5e0!3m2!1sen!2sgr",
  },

  manifest: {
    backgroundColor: ${JSON.stringify(data.backgroundColor || '#ffffff')},
    display: "standalone" as const,
  },
} as const;

export const isMultilingual = SITE.languages.length > 1;
export const defaultLanguage = SITE.languages[0];

export function generateBusinessSchema() {
  const { business, url, rating, reviews } = SITE;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.legalName,
    alternateName: business.alternateName,
    image: \`\${SITE.url}\${SITE.heroImage}\`,
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
    description: SITE.description,
    areaServed: { "@type": "City", name: business.address.locality },
    sameAs: [business.social.facebook, business.social.instagram],
  };
  if (reviews.length > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      bestRating: rating.best,
      ratingCount: rating.count || reviews.length,
      reviewCount: reviews.length,
    };
    schema.review = reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: r.quote || r.body,
      reviewRating: { "@type": "Rating", ratingValue: r.rating || '5', bestRating: rating.best },
    }));
  }
  return schema;
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: \`\${SITE.url}/faq/?q={search_term_string}\`,
      "query-input": "required name=search_term_string",
    },
  };
}

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
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: \`\${SITE.url}\${item.url}\`,
    })),
  };
}

export function canonicalUrl(path) {
  const normalized = path.endsWith("/") ? path : \`\${path}/\`;
  return normalized === "/" ? \`\${SITE.url}/\` : \`\${SITE.url}\${normalized}\`;
}
`;

  const outPath = join(PROJECT_ROOT, 'src', 'data', 'site.config.ts');
  writeFileSync(outPath, out, 'utf-8');
  console.log(`  ✓ Wrote ${outPath}`);
}

function writeThemeCSS(brandColor) {
  const shades = hexToTailwindShades(brandColor);
  const themeBlock = `@theme {
  --color-brand-50: ${shades['50']};
  --color-brand-100: ${shades['100']};
  --color-brand-200: ${shades['200']};
  --color-brand-300: ${shades['300']};
  --color-brand-400: ${shades['400']};
  --color-brand-500: ${shades['500']};
  --color-brand-600: ${shades['600']};
  --color-brand-700: ${shades['700']};
  --color-brand-800: ${shades['800']};
  --color-brand-900: ${shades['900']};
  --color-brand-950: ${shades['950']};

  --font-family-sans: 'Inter', sans-serif;

  --animate-shimmer: shimmer 2s ease-in-out infinite;
  --animate-float: float 3s ease-in-out infinite;
  --animate-pulse-ring: pulse-ring 2s ease-out infinite;
  --animate-ken-burns: ken-burns 12s ease-in-out infinite alternate;
  --animate-skeleton: skeleton 1.5s ease-in-out infinite;
  --animate-wave-line: wave-line 8s linear infinite;
  --animate-counter-fade: counter-fade 0.6s ease-out;
  --animate-slide-down: slide-down 0.3s ease-out;
  --animate-fade-up: fade-up 0.4s ease-out;
  --animate-slide-in-right: slide-in-right 0.3s ease-out;
  --animate-magnify-pulse: magnify-pulse 1.5s ease-in-out infinite;
}`;

  const outPath = join(PROJECT_ROOT, 'src', 'styles', 'theme.css');
  const existing = readFileSync(outPath, 'utf-8');

  // Preserve font-face declarations, replace only the @theme block
  const updated = existing.replace(/@theme \{[\s\S]*?\n\}/, themeBlock);

  writeFileSync(outPath, updated, 'utf-8');
  console.log(`  ✓ Updated ${outPath} with brand color ${brandColor}`);
}

function writeContentServices(services) {
  const items = services.length > 0 ? services : [
    { name: 'Category One', description: 'Describe your first service or product category.', position: 1 },
    { name: 'Category Two', description: 'Describe your second service or product category.', position: 2 },
    { name: 'Category Three', description: 'Describe your third service or product category.', position: 3 },
  ];

  const out = `// Auto-generated by scripts/setup.mjs — Edit to add more services

export interface ServiceCategory {
  name: string;
  description: string;
  position: number;
}

export const services: ServiceCategory[] = ${JSON.stringify(items, null, 2)};
`;

  const outPath = join(PROJECT_ROOT, 'src', 'data', 'content', 'services.ts');
  writeFileSync(outPath, out, 'utf-8');
  console.log(`  ✓ Wrote ${outPath}`);
}

function writeContentTestimonials(reviews) {
  const items = reviews.length > 0 ? reviews : [
    {
      quote: 'Add your customer reviews here — they appear in the testimonial slider on the homepage.',
      name: 'Customer Name',
      role: 'Google Reviewer',
      avatar: '/images/placeholder.svg',
      rating: 5,
      source: 'google',
      sourceUrl: '',
    },
  ];

  const out = `// Auto-generated by scripts/setup.mjs — Edit to add more reviews

export const SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  facebook: "Facebook",
  manual: "Customer",
};

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  source: string;
  sourceUrl?: string;
}

export const testimonials: Testimonial[] = ${JSON.stringify(items, null, 2)};
`;

  const outPath = join(PROJECT_ROOT, 'src', 'data', 'content', 'testimonials.ts');
  writeFileSync(outPath, out, 'utf-8');
  console.log(`  ✓ Wrote ${outPath}`);
}

function writeContentFaq(faqs) {
  const items = faqs.length > 0 ? faqs : [
    { q: 'What are your business hours?', a: 'Add your first FAQ answer here.' },
    { q: 'How can I contact you?', a: 'Add your second FAQ answer here.' },
    { q: 'Where are you located?', a: 'Add your third FAQ answer here.' },
  ];

  const out = `// Auto-generated by scripts/setup.mjs — Edit to add more FAQ items

export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = ${JSON.stringify(items, null, 2)};

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
`;

  const outPath = join(PROJECT_ROOT, 'src', 'data', 'content', 'faq.ts');
  writeFileSync(outPath, out, 'utf-8');
  console.log(`  ✓ Wrote ${outPath}`);
}

function writeContentGallery() {
  const items = [
    { src: '/images/placeholder.svg', alt: 'Replace with your gallery image 1' },
    { src: '/images/placeholder.svg', alt: 'Replace with your gallery image 2' },
    { src: '/images/placeholder.svg', alt: 'Replace with your gallery image 3' },
    { src: '/images/placeholder.svg', alt: 'Replace with your gallery image 4' },
    { src: '/images/placeholder.svg', alt: 'Replace with your gallery image 5' },
  ];

  const out = `// Auto-generated by scripts/setup.mjs — Add your actual image paths

export interface GalleryImage {
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = ${JSON.stringify(items, null, 2)};
`;

  const outPath = join(PROJECT_ROOT, 'src', 'data', 'content', 'gallery.ts');
  writeFileSync(outPath, out, 'utf-8');
  console.log(`  ✓ Wrote ${outPath}`);
}

function writeContentDeliveryAreas() {
  const items = [
    { title: 'Your City', description: 'Describe your service area.', image: '/images/placeholder.svg', tags: ['Local'] },
  ];

  const out = `// Auto-generated by scripts/setup.mjs — Edit to add your service areas

export interface DeliveryArea {
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export const deliveryAreas: DeliveryArea[] = ${JSON.stringify(items, null, 2)};
`;

  const outPath = join(PROJECT_ROOT, 'src', 'data', 'content', 'delivery-areas.ts');
  writeFileSync(outPath, out, 'utf-8');
  console.log(`  ✓ Wrote ${outPath}`);
}

// ── Additional File Writers ───────────────────────────────────────

function writeAstroConfig(url) {
  const configPath = join(PROJECT_ROOT, 'astro.config.mjs');
  const existing = readFileSync(configPath, 'utf-8');
  const updated = existing.replace(/site: 'https:\/\/[^']+'/, `site: '${url}'`);
  writeFileSync(configPath, updated, 'utf-8');
  console.log(`  ✓ Updated ${configPath} (site: ${url})`);
}

function writeManifest(data) {
  const manifestPath = join(PROJECT_ROOT, 'public', 'manifest.json');
  const manifest = {
    name: data.name,
    short_name: data.shortName,
    description: data.description,
    start_url: '/',
    display: 'standalone',
    background_color: data.backgroundColor || '#ffffff',
    theme_color: data.brandColor,
    icons: [
      { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log(`  ✓ Updated ${manifestPath}`);
}

function writeRobotsTxt(url) {
  const robotsPath = join(PROJECT_ROOT, 'public', 'robots.txt');
  const robots = `User-agent: *
Allow: /

Sitemap: ${url}/sitemap-index.xml
`;
  writeFileSync(robotsPath, robots, 'utf-8');
  console.log(`  ✓ Updated ${robotsPath}`);
}

function writePostSetupChecklist(data) {
  const checklistPath = join(PROJECT_ROOT, 'POST-SETUP.md');
  const checklist = `# Post-Setup Checklist

Your site config has been generated. Complete these remaining steps before going live.

## 1. Google Search Console Verification (optional but recommended)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: \`${data.url}\`
3. Copy the verification code
4. Edit \`src/data/site.config.ts\` → set \`googleVerification\` to your code

## 2. Replace Favicons

The template ships with placeholder favicons. Replace these with your own:

| File | Size |
|------|------|
| \`public/favicon.svg\` | SVG source |
| \`public/favicon-32x32.png\` | 32×32 |
| \`public/favicon-192x192.png\` | 192×192 |
| \`public/favicon-512x512.png\` | 512×512 |
| \`public/apple-touch-icon.png\` | 180×180 |

Generate from a square logo using: https://realfavicongenerator.net/

## 3. Replace Logo

Replace \`public/logo.svg\` with your actual logo SVG file.

## 4. Add Real Images

1. Place your images in a folder (e.g. \`content/images/\`)
2. Run: \`npm run images -- content/images\`
3. This generates WebP responsive variants and updates the gallery

## 5. Add Blog Posts (optional)

Edit \`src/data/content/blog.ts\` to add real blog posts.
Each post needs: slug, title, excerpt, content (HTML), image, date, category, tags.

## 6. Update Google Maps Embed

Edit \`src/data/site.config.ts\` → \`maps.googleMaps\` and \`maps.openStreetMap\`
with your actual location embed URLs.

## 7. Deploy

\`\`\`bash
npm run build    # Generates ./dist/
\`\`\`

Deploy the \`dist/\` folder to any static host:
- **Netlify**: Drag \`dist/\` to [netlify.app/drop](https://app.netlify.com/drop)
- **Vercel**: \`npx vercel\`
- **Cloudflare Pages**: Connect repo, set build command to \`npm run build\`, output dir to \`dist\`
- **GitHub Pages**: Push \`dist/\` to \`gh-pages\` branch

## 8. Submit Sitemap to Google

After deploying, submit your sitemap:
1. Google Search Console → Sitemaps
2. Enter: \`sitemap-index.xml\`
`;
  writeFileSync(checklistPath, checklist, 'utf-8');
  console.log(`  ✓ Wrote ${checklistPath}`);
}

// ── Config mode (non-interactive) ────────────────────────────────

function runFromConfig(configData) {
  const data = {
    name: configData.name || 'Your Business Name',
    shortName: configData.shortName || (configData.name?.length > 10 ? configData.name.slice(0, 10) : configData.name) || 'Business',
    tagline: configData.tagline || 'Your Tagline Here',
    description: configData.description || `${configData.name || 'Business'} — ${configData.tagline || 'Tagline'}`,
    url: configData.url || 'https://yourdomain.com',
    language: configData.language || 'en',
    legalName: configData.legalName || `${configData.name || 'Business'} — Owner`,
    alternateName: configData.alternateName || '',
    yearEstablished: configData.yearEstablished || new Date().getFullYear() - 5,
    priceRange: configData.priceRange || '€€',
    phone: configData.phone || { display: '210 000 0000', raw: '+302100000000' },
    email: configData.email || 'info@yourdomain.com',
    whatsappUrl: configData.whatsappUrl || `https://wa.me/${(configData.phone?.raw || '+302100000000').replace(/[^0-9]/g, '')}`,
    address: configData.address || { street: '123 Main Street', locality: 'Your City', region: 'Your Region', postalCode: '12345', country: 'GR', countryName: 'Greece' },
    geo: configData.geo || { latitude: '37.9838', longitude: '23.7275' },
    hours: configData.hours || { display: 'Mon-Fri 9:00-18:00', shortDisplay: 'Mon-Fri 9-6', schema: 'Mo,Tu,We,Th,Fr 09:00-18:00' },
    social: configData.social || { facebook: '', instagram: '', twitter: '' },
    serviceAreas: configData.serviceAreas || [configData.address?.locality || 'Your City'],
    brandColor: configData.brandColor || '#6b7280',
    logoPath: configData.logoPath || '/logo.svg',
    heroImage: configData.heroImage || '/images/placeholder.svg',
    trustSignals: configData.trustSignals || [
      { label: 'Years of Experience', value: '10+ Years' },
      { label: 'Availability', value: 'Mon-Fri 9-6' },
      { label: 'Quality', value: 'Customer Focused' },
    ],
    rating: configData.rating || { value: '5.0', count: 0 },
    reviews: configData.reviews || [],
    backgroundColor: configData.backgroundColor || '#ffffff',
  };

  console.log('\n── Generating Files from config ──');
  writeSiteConfig(data);
  writeThemeCSS(data.brandColor);
  writeContentServices(configData.services || []);
  writeContentTestimonials(configData.reviews || []);
  writeContentFaq(configData.faqs || []);
  writeContentGallery();
  writeContentDeliveryAreas();
  writeAstroConfig(data.url);
  writeManifest(data);
  writeRobotsTxt(data.url);
  writePostSetupChecklist(data);

  console.log('\n✓ Setup complete!');
  console.log('  Next steps:');
  console.log('  1. Read POST-SETUP.md for remaining tasks');
  console.log('  2. Add images: npm run images -- <folder>');
  console.log('  3. Run: npm run dev');
  console.log('  4. Build: npm run build\n');
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // --help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  node scripts/setup.mjs                        Interactive wizard
  node scripts/setup.mjs --config <file.json>   Non-interactive (for AI agents)

The --config flag reads a JSON file with all business data:
{
  "name": "Business Name",
  "tagline": "Tagline",
  "description": "SEO description",
  "url": "https://example.com",
  "language": "en",
  "phone": { "display": "210 000 0000", "raw": "+302100000000" },
  "email": "info@example.com",
  "address": { "street": "...", "locality": "...", "region": "...", "postalCode": "...", "country": "GR", "countryName": "Greece" },
  "geo": { "latitude": "39.1", "longitude": "23.4" },
  "hours": { "display": "...", "shortDisplay": "...", "schema": "Mo,Tu,We,Th,Fr 09:00-18:00" },
  "social": { "facebook": "...", "instagram": "...", "twitter": "..." },
  "brandColor": "#6b7280",
  "services": [{ "name": "...", "description": "..." }],
  "faqs": [{ "q": "...", "a": "..." }],
  "reviews": [{ "quote": "...", "name": "...", "rating": 5 }]
}
`);
    process.exit(0);
  }

  // --config <file>
  const configIdx = args.indexOf('--config');
  if (configIdx !== -1 && args[configIdx + 1]) {
    const configPath = args[configIdx + 1];
    if (!existsSync(configPath)) {
      console.error(`Error: Config file not found: ${configPath}`);
      process.exit(1);
    }
    const configData = JSON.parse(readFileSync(configPath, 'utf-8'));
    runFromConfig(configData);
    return;
  }

  // Interactive mode
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     Website Setup Wizard                         ║');
  console.log('║     Answer the questions to configure your site  ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  const rl = createInterface({ input, output });
  const data = {
    name: '',
    shortName: '',
    tagline: '',
    description: '',
    url: 'https://yourdomain.com',
    language: 'en',
    legalName: '',
    alternateName: '',
    yearEstablished: new Date().getFullYear(),
    priceRange: '€€',
    phone: { display: '', raw: '' },
    email: '',
    whatsappUrl: '',
    address: { street: '', locality: '', region: '', postalCode: '', country: 'GR', countryName: 'Greece' },
    geo: { latitude: '37.9838', longitude: '23.7275' },
    hours: { display: '', shortDisplay: '', schema: '' },
    social: { facebook: '', instagram: '', twitter: '' },
    serviceAreas: [],
    brandColor: '#6b7280',
    logoPath: '/logo.svg',
    heroImage: '/images/placeholder.svg',
    trustSignals: [
      { label: 'Years of Experience', value: '10+ Years' },
      { label: 'Availability', value: 'Mon-Fri 9-6' },
      { label: 'Quality', value: 'Customer Focused' },
    ],
    rating: { value: '5.0', count: 0 },
    reviews: [],
    backgroundColor: '#ffffff',
  };

  try {
    // ── Phase 1: Identity ──
    console.log('\n── Phase 1: Business Identity ──');
    data.name = await ask(rl, 'Business name', 'Your Business Name');
    data.shortName = await ask(rl, 'Short name (for mobile)', data.name.length > 10 ? data.name.slice(0, 10) : data.name);
    data.tagline = await ask(rl, 'Tagline', 'Your Tagline Here');
    data.description = await ask(rl, 'Short description (for SEO meta)', `${data.name} — ${data.tagline}`);
    data.url = await ask(rl, 'Website URL', 'https://yourdomain.com');
    data.language = await ask(rl, 'Primary language (en/el)', 'en');
    data.legalName = await ask(rl, 'Legal business name', `${data.name} — Owner`);
    data.alternateName = await ask(rl, 'Alternate name (optional)', data.language === 'el' ? data.name : '');

    // ── Phase 2: Contact ──
    console.log('\n── Phase 2: Contact & Location ──');
    data.phone.display = await ask(rl, 'Phone (display)', '210 000 0000');
    data.phone.raw = await ask(rl, 'Phone (raw, with country code)', '+302100000000');
    data.email = await ask(rl, 'Email', 'info@yourdomain.com');
    data.whatsappUrl = await ask(rl, 'WhatsApp URL', `https://wa.me/${data.phone.raw.replace(/[^0-9]/g, '')}`);
    data.address.street = await ask(rl, 'Street address', '123 Main Street');
    data.address.locality = await ask(rl, 'City', 'Your City');
    data.address.region = await ask(rl, 'Region', 'Your Region');
    data.address.postalCode = await ask(rl, 'Postal code', '12345');
    data.address.country = await ask(rl, 'Country code (e.g. GR)', 'GR');
    data.address.countryName = await ask(rl, 'Country name', data.address.country === 'GR' ? 'Greece' : 'Your Country');

    data.geo.latitude = await ask(rl, 'Latitude (e.g. 39.1167)', '39.1167');
    data.geo.longitude = await ask(rl, 'Longitude (e.g. 23.4833)', '23.4833');

    data.hours.display = await ask(rl, 'Business hours (display)', 'Mon-Fri 9:00-18:00');
    data.hours.shortDisplay = await ask(rl, 'Business hours (short)', data.hours.display.length > 15 ? 'Mon-Fri 9-6' : data.hours.display);
    data.hours.schema = await ask(rl, 'Business hours (schema format, e.g. Mo,Tu,We,Th,Fr 09:00-18:00)', 'Mo,Tu,We,Th,Fr 09:00-18:00');
    data.yearEstablished = parseInt(await ask(rl, 'Year established', String(new Date().getFullYear() - 5)));

    // ── Phase 3: Social ──
    console.log('\n── Phase 3: Social & Online ──');
    data.social.facebook = await ask(rl, 'Facebook URL', 'https://www.facebook.com/yourbusiness');
    data.social.instagram = await ask(rl, 'Instagram URL', 'https://www.instagram.com/yourbusiness/');
    data.social.twitter = await ask(rl, 'Twitter handle', '@yourbusiness');

    // ── Phase 4: Services ──
    console.log('\n── Phase 4: Services & Content ──');
    const hasServices = await askYesNo(rl, 'Enter your services?', 'n');
    const servicesList = hasServices ? await askServiceList(rl) : [];

    // Reviews
    const hasReviews = await askYesNo(rl, 'Enter customer reviews?', 'n');
    let reviewsList = [];
    if (hasReviews) {
      const reviewUrl = await ask(rl, 'Paste a Google Maps / TripAdvisor link (or press Enter for manual entry)');
      if (reviewUrl.startsWith('http://') || reviewUrl.startsWith('https://')) {
        console.log(`  → Review URL saved: ${reviewUrl}`);
        console.log('  → The AI agent should fetch this URL and extract the reviews.');
        console.log('  → For now, using placeholder reviews.');
        reviewsList = [];
      } else {
        console.log('  → Enter reviews manually. Press Enter on quote to finish.');
        reviewsList = await askReviews(rl, []);
      }
    }

    // FAQ
    const hasFaq = await askYesNo(rl, 'Enter FAQ items?', 'n');
    const faqList = hasFaq ? await askFaqList(rl) : [];

    // ── Phase 5: Branding ──
    console.log('\n── Phase 5: Branding ──');
    data.brandColor = await ask(rl, 'Brand color (hex, e.g. #6b7280)', '#6b7280');
    while (!validateHex(data.brandColor)) {
      console.log('  Invalid hex color. Please use format #RRGGBB');
      data.brandColor = await ask(rl, 'Brand color (hex)', '#6b7280');
    }

    const hasLogo = await askYesNo(rl, 'Do you have a logo SVG file?', 'n');
    if (hasLogo) {
      data.logoPath = await ask(rl, 'Path to logo SVG (relative to public/)', '/logo.svg');
    }

    // ── Phase 6: Service Areas ──
    console.log('\n── Service Areas ──');
    const hasAreas = await askYesNo(rl, 'Enter service areas?', 'n');
    if (hasAreas) {
      data.serviceAreas = await askList(rl, '  Service area name');
    } else {
      data.serviceAreas = [data.address.locality];
    }

    // ── Trust Signals ──
    console.log('\n── Trust Signals (shown in hero section) ──');
    const customizeTrust = await askYesNo(rl, 'Customize trust signals?', 'n');
    if (customizeTrust) {
      data.trustSignals = [];
      for (let i = 0; i < 3; i++) {
        const label = await ask(rl, `  Signal ${i + 1} label`, data.trustSignals[i]?.label || '');
        const value = await ask(rl, `  Signal ${i + 1} value`, data.trustSignals[i]?.value || '');
        if (label && value) data.trustSignals.push({ label, value });
      }
    }

    // ── Generate Files ──
    console.log('\n── Generating Files ──');
    writeSiteConfig(data);
    writeThemeCSS(data.brandColor);
    writeContentServices(servicesList);
    writeContentTestimonials(reviewsList);
    writeContentFaq(faqList);
    writeContentGallery();
    writeContentDeliveryAreas();
    writeAstroConfig(data.url);
    writeManifest(data);
    writeRobotsTxt(data.url);
    writePostSetupChecklist(data);

    console.log('\n✓ Setup complete!');
    console.log('  Next steps:');
    console.log('  1. Read POST-SETUP.md for remaining tasks (favicons, Google verification, deploy)');
    console.log('  2. Add images: npm run images -- <folder>');
    console.log('  3. Run: npm run dev');
    console.log('  4. Build: npm run build\n');

  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
