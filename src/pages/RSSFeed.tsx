import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const RSSFeed = () => {
  const { data: articles } = useQuery({
    queryKey: ['rss-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (articles) {
      const rss = generateRSSFeed(articles);
      const blob = new Blob([rss], { type: 'application/rss+xml' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feed.xml';
      a.click();
    }
  }, [articles]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Generating RSS Feed...</h1>
        <p className="text-muted-foreground">Your RSS feed will download automatically</p>
      </div>
    </div>
  );
};

function generateRSSFeed(articles: any[]) {
  const siteUrl = window.location.origin;
  const buildDate = new Date().toUTCString();

  const items = articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/blog/${article.slug}</link>
      <guid>${siteUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
      ${article.category ? `<category>${article.category}</category>` : ''}
      ${article.featured_image ? `<enclosure url="${article.featured_image}" type="image/jpeg" />` : ''}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog - Portfolio</title>
    <link>${siteUrl}/blog</link>
    <description>Latest articles, tutorials and insights</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

export default RSSFeed;
