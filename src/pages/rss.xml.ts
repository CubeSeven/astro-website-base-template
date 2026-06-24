import type { APIRoute } from 'astro';
import { SITE } from '../data/site.config';
import { getSortedPosts } from '../data/content/blog';

export const GET: APIRoute = ({ site }) => {
  const posts = getSortedPosts();
  const siteUrl = SITE.url;

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE.name}</title>
    <link>${siteUrl}</link>
    <description>${SITE.description}</description>
    <language>${SITE.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}${SITE.blog.path}/${post.slug}/</link>
      <guid isPermaLink="true">${siteUrl}${SITE.blog.path}/${post.slug}/</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category>${post.category}</category>` : ''}
      ${post.image ? `<media:content url="${siteUrl}${post.image}" medium="image"/>` : ''}
    </item>`,
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
