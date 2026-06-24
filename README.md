# Astro Business Website Template

A production-ready Astro website skeleton for local businesses. Built with **Astro 6**, **Tailwind CSS v4**, and **TypeScript**. Optimized for SEO, accessibility, performance, and multilingual support.

## Quick Start — Using This Template for a New Project

### AI Agent Workflow (recommended)

If you're using an AI coding agent (opencode, Cursor, etc.), the agent will follow `SETUP.md`:

```bash
cp -r "path/to/this/template" my-new-project
cd my-new-project
npm install

# The agent collects your info, writes a JSON config, then runs:
node scripts/setup.mjs --config setup-data.json

# Or use the interactive wizard:
npm run setup

npm run dev         # Start developing
```

The agent will prompt you for business info, content, and images phase by phase.

### Manual Setup

```bash
# 1. Copy the template
cp -r "path/to/this/template" my-new-project
cd my-new-project

# 2. Install dependencies
npm install

# 3. Run the setup wizard
npm run setup

# 4. Start developing
npm run dev
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Interactive config wizard — asks about business, services, reviews, branding |
| `npm run images` | Image pipeline — optimizes images, generates WebP, updates gallery |
| `npm run dev` | Start development server at localhost:4321 |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

## Customizing for Your Business

### Step 0: Run the Setup Wizard (recommended)

```bash
npm run setup
```

The wizard will ask about your business and generate all configuration files automatically.

### Step 1: Site Config — `src/data/site.config.ts`

Edit the single source of truth — business info, SEO, navigation, social links, contact details, languages, **blog settings**, and more.

Key sections to update:
| Section | Description |
|---------|-------------|
| `name`, `url`, `description` | Site identity & SEO |
| `languages` | Add/remove languages (language switcher auto-enables) |
| `business` | Contact, address, hours, social, service areas |
| `seo` | OG tags, Twitter cards, theme color |
| `nav` | Main menu & footer links |
| `blog` | Blog path, description, posts per page |

### Step 2: Page Content — `src/data/content/*.ts`

| File | Content |
|------|---------|
| `testimonials.ts` | Customer reviews and ratings |
| `faq.ts` | FAQ questions and answers |
| `delivery-areas.ts` | Service/delivery area descriptions |
| `gallery.ts` | Gallery images and alt text |
| `services.ts` | Product/service categories |
| **`blog.ts`** | **Blog posts (NEW)** — each post = slug, title, excerpt, content, image, date, category, tags |

### Step 3: Brand Colors & Fonts — `src/styles/theme.css`

- Replace `--color-brand-50` through `--color-brand-950` with your palette
- Swap font files in `/public/fonts/` and update `@font-face` declarations
- Change `--font-family-sans` if using a different font

### Step 4: Replace Static Assets

| File | What to replace |
|------|----------------|
| `public/logo.svg` | Your logo SVG |
| `public/favicon-*.png` | Your favicons |
| `public/apple-touch-icon.png` | Apple touch icon |
| `public/manifest.json` | Update `name`, `short_name`, `description` |
| `public/robots.txt` | Update domain and sitemap URL (default: `/sitemap-index.xml`) |
| `Images/` directory | Replace with your own images |

### Step 5: Enable Multilingual Support (Optional)

By default, the template is single-language. To add languages:

1. Open `src/data/site.config.ts`
2. Add entries to the `languages` array, e.g. `{ code: "el", label: "Ελληνικά", locale: "el_GR" }`
3. The language switcher will appear automatically
4. **Important:** Only add multiple languages if you actually create translated pages at language-prefixed URLs (e.g. `/el/about`). Otherwise, leave only your default language to avoid incorrect `hreflang` tags.

### Step 5: Set Site URL in `astro.config.mjs`

Change `site: 'https://yourdomain.com'` to your actual domain (required for sitemap generation).

> **Note:** The setup wizard (`npm run setup`) does this automatically.

### Step 6: Run & Deploy

```bash
npm run dev           # Start dev server on localhost:4321
npm run build         # Build production site to ./dist/
npm run preview       # Preview the production build
```

## Deployment

After `npm run build`, deploy the `dist/` folder to any static host:

| Host | How |
|------|-----|
| **Netlify** | Drag `dist/` to [netlify.app/drop](https://app.netlify.com/drop) or connect repo |
| **Vercel** | `npx vercel` — auto-detects Astro |
| **Cloudflare Pages** | Connect repo, build command: `npm run build`, output: `dist` |
| **GitHub Pages** | Push `dist/` to `gh-pages` branch |

After deploying, submit your sitemap to Google Search Console:
1. Go to Search Console → Sitemaps
2. Enter `sitemap-index.xml`

---

## Project Structure

```
├── AGENTS.md                 ★ AI agent behavior rules
├── SETUP.md                  ★ Onboarding checklist for AI agents
├── scripts/
│   ├── setup.mjs             ★ Interactive config wizard
│   └── process-images.mjs    ★ Image optimization pipeline
├── src/
│   ├── data/
│   │   ├── site.config.ts          ★ Single source of truth for all business data
│   │   └── content/                ★ Page content separated by type
│   │       ├── testimonials.ts
│   │       ├── faq.ts
│   │       ├── delivery-areas.ts
│   │       ├── gallery.ts
│   │       ├── services.ts
│   │       └── blog.ts             ★ Blog posts with full content & metadata
│   ├── components/                  Reusable Astro components
│   │   ├── Layout.astro            HTML shell, SEO metadata, structured data
│   │   ├── Header.astro            Sticky navigation (reads from config)
│   │   ├── Footer.astro            Multi-column footer (reads from config)
│   │   ├── Hero.astro              Full-screen hero section
│   │   ├── CTA.astro               Call-to-action component
│   │   ├── Features.astro          Feature cards grid
│   │   ├── TestimonialsSlider.astro
│   │   ├── DeliveryAreasSlider.astro
│   │   ├── FAQ.astro (inline)
│   │   ├── Lightbox.astro
│   │   ├── Breadcrumbs.astro
│   │   ├── BlogCard.astro          ★ Blog post card component
│   │   └── LanguageSwitcher.astro  ★ Language toggle dropdown
│   ├── pages/                       Route files (one .astro per URL)
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── contact.astro
│   │   ├── faq.astro
│   │   ├── gallery.astro
│   │   ├── 404.astro
│   │   ├── blog/                   ★ Blog section
│   │   │   ├── index.astro         ★ Blog listing page
│   │   │   └── [slug].astro        ★ Individual blog post page
│   │   └── rss.xml.ts              ★ Auto-generated RSS feed
│   ├── styles/
│   │   ├── theme.css               ★ Brand colors, fonts, border-radius
│   │   └── global.css               Structural CSS (animations, components, layout)
│   └── utils/
│       └── images.ts                Responsive image helpers (srcset/sizes)
```

---

## Key Features

- **Single-source configuration** — Change business info, SEO, and content in a few files
- **JSON-LD structured data** — `LocalBusiness`, `WebSite`, `FAQPage`, `ContactPoint`, `ItemList`, `BreadcrumbList`, `BlogPosting` schemas auto-generated from config
- **Self-hosted fonts** — No Google Fonts request chain; Inter with Latin + Greek subsets
- **Responsive images** — `srcset`/`sizes` with WebP for all display contexts
- **Scroll animations** — IntersectionObserver-based with staggered delays
- **Production-ready SEO** — Open Graph, Twitter Cards, canonical, hreflang, robots, Google verification, **auto-generated sitemap**
- **Blog** — Built-in blog with listing, individual posts, categories, tags, and **RSS feed**
- **Multilingual support** — Language switcher component + hreflang tags (configurable in site config)
- **PWA-ready** — Manifest, favicons, apple-touch-icon
- **Accessible** — Skip-to-content link, ARIA labels, semantic HTML
- **Performance** — Static site generation, font preloads, hero image preload, lazy loading

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Astro 6 (static generation) |
| CSS | Tailwind CSS v4 |
| Icons | astro-icon + Lucide |
| Carousels | Swiper 12 |
| Sitemap | astro-sitemap (auto-generated) |
| TypeScript | Strict mode |

---

## License

MIT — Use freely for your own projects.
