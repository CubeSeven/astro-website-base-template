// Replace with your blog posts.
// These appear on the /blog page and individual post pages.
// Blog posts also generate RSS feed entries automatically.

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  alt: string;
  author: string;
  date: string; // ISO 8601 date string, e.g. "2025-01-15"
  category: string;
  tags: string[];
  featured?: boolean;
  readingTime?: number; // in minutes (auto-calculated if omitted)
}

export const blogPosts: BlogPost[] = [
  {
    slug: "welcome-to-our-blog",
    title: "Welcome to Our Blog",
    excerpt:
      "A brief introduction to our blog. Replace this with your own content.",
    content: `
      <p>This is a placeholder blog post. Replace it with your own content.</p>
      <p>Blog posts are written in HTML and stored in <code>src/data/content/blog.ts</code>. Each post needs a unique slug, title, excerpt, full content, image, and metadata.</p>
      <h2>Why Blog?</h2>
      <p>Blogging helps your website rank better in search engines, builds trust with customers, and gives you content to share on social media.</p>
      <h2>What to Write About</h2>
      <ul>
        <li>Company news and updates</li>
        <li>Product or service highlights</li>
        <li>Industry tips and advice</li>
        <li>Customer success stories</li>
        <li>Behind-the-scenes looks</li>
      </ul>
    `,
    image: "/images/placeholder.svg",
    alt: "Welcome to our blog — placeholder image",
    author: "Your Name",
    date: "2025-01-01",
    category: "General",
    tags: ["welcome", "introduction"],
    featured: true,
    readingTime: 2,
  },
  {
    slug: "sample-post-2",
    title: "Sample Blog Post: Tips & Advice",
    excerpt:
      "A sample post to demonstrate the blog layout. Replace with your own content.",
    content: `
      <p>This is another placeholder blog post. It demonstrates how multiple posts look on the blog listing page.</p>
      <p>You can add as many posts as you like. Each post will appear on the blog listing page with its title, excerpt, date, and category.</p>
    `,
    image: "/images/placeholder.svg",
    alt: "Sample blog post image",
    author: "Your Name",
    date: "2025-02-15",
    category: "Tips",
    tags: ["tips", "sample"],
    readingTime: 3,
  },
  {
    slug: "sample-post-3",
    title: "Announcing Our Latest Updates",
    excerpt:
      "Share news and announcements about your business here.",
    content: `
      <p>Use blog posts to announce new products, services, or changes to your business.</p>
      <p>Regular updates show search engines that your site is active and relevant, which helps with rankings.</p>
    `,
    image: "/images/placeholder.svg",
    alt: "Announcement image",
    author: "Your Name",
    date: "2025-03-20",
    category: "News",
    tags: ["news", "updates"],
    readingTime: 1,
  },
];

// ── Helper: get sorted blog posts (newest first) ─────────────────
export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// ── Helper: get featured posts ───────────────────────────────────
export function getFeaturedPosts(): BlogPost[] {
  return getSortedPosts().filter((p) => p.featured);
}

// ── Helper: get post by slug ─────────────────────────────────────
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

// ── Helper: get unique categories from posts ─────────────────────
export function getCategories(): string[] {
  return [...new Set(blogPosts.map((p) => p.category))];
}
