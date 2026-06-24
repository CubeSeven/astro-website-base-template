# Project Setup — Onboarding Checklist

This file guides the AI agent through collecting requirements and initializing a new project from this boilerplate.

## Instructions for the AI Agent

Interview the user phase by phase. Ask one question at a time. After collecting all info, run `node scripts/setup.mjs` to generate the config (or write the files directly if you prefer).

---

## Phase 1 — Business Identity

Ask the user:

- **Business name** (e.g. "Traditional Skiathos Market")
- **Short tagline** (e.g. "Local Products & More")
- **Short description** (1-2 sentences for SEO meta description)
- **Website URL** (or leave as placeholder)
- **Primary language** (e.g. "en" for English, "el" for Greek)

## Phase 2 — Contact & Location

Ask the user:

- **Phone number** (display and raw format, e.g. "+30 24270 00000")
- **Email address**
- **WhatsApp number** (same as phone or different)
- **Street address** (street, city, region, postal code, country)
- **Geo coordinates** (latitude, longitude — for Google Maps embed and schema)
- **Business hours** (display text and schema format)
- **Year established**

## Phase 3 — Social & Online Presence

Ask the user:

- **Facebook page URL**
- **Instagram profile URL**

## Phase 4 — Services & Content

Ask the user:

- **Services/Product categories** (list of names with descriptions, or type "skip" to use placeholders)
- **Testimonials / Reviews** — accept either:
  - A Google Maps review link (e.g. `https://maps.app.goo.gl/...` or search URL)
  - A TripAdvisor review link (e.g. `https://www.tripadvisor.com/...`)
  - A list of manual reviews (name, rating, quote)
  - Or "skip" to use placeholders
- **FAQ questions & answers** (list of Q&A pairs, or "skip")
- **Gallery images** — ask if they have images to provide (a folder path)

## Phase 5 — Branding

Ask the user:

- **Primary brand color** (hex code, or leave default gray)
- **Logo file** (SVG preferred, provide path or skip)

## Phase 6 — Images

If the user has images:

- Ask for the folder path containing images
- After setup, run `node scripts/process-images.mjs <path>` to optimize them

---

## After collecting all info

### Option A: Use the setup script with JSON config (recommended for AI agents)

Write the collected data to a JSON file, then run:

```bash
node scripts/setup.mjs --config setup-data.json
```

This generates ALL config files non-interactively. See `node scripts/setup.mjs --help` for the JSON schema.

### Option B: Use the setup script interactively

```bash
node scripts/setup.mjs
```

The script will prompt for the same information interactively.

### Option C: Write files directly

If you prefer, write the following files with the collected data:

| File | What to write |
|------|---------------|
| `src/data/site.config.ts` | Business config with real data |
| `src/data/content/services.ts` | Service categories |
| `src/data/content/testimonials.ts` | Customer reviews |
| `src/data/content/faq.ts` | FAQ Q&A pairs |
| `src/data/content/gallery.ts` | Gallery image paths and alt text |

### Final verification

```bash
npm run build
```

The build must complete without errors.

## After setup — Post-Setup Checklist

The setup script generates a `POST-SETUP.md` file with remaining manual tasks:

1. **Google Search Console verification** — get code, add to config
2. **Replace favicons** — generate from logo at realfavicongenerator.net
3. **Replace logo** — swap `public/logo.svg`
4. **Add real images** — `npm run images -- <folder>`
5. **Add blog posts** — edit `src/data/content/blog.ts`
6. **Update Google Maps embed** — set real coordinates in config
7. **Deploy** — `npm run build`, deploy `dist/` to Netlify/Vercel/Cloudflare
8. **Submit sitemap** — Google Search Console → Sitemaps → `sitemap-index.xml`

The AI agent should walk the user through these steps after the setup script completes.
