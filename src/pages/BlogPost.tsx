import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import { useAnalytics } from '@/hooks/useAnalytics';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, ArrowLeft, Share2, Tag, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { CommentsSection } from '@/components/blog/CommentsSection';
import { RelatedArticles } from '@/components/blog/RelatedArticles';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ArticleReactions } from '@/components/blog/ArticleReactions';
import { usePageSEO } from '@/hooks/usePageSEO';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { trackPageView, trackEvent } = useAnalytics();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Dynamic SEO
  usePageSEO({
    title: article?.seo_title || article?.title,
    description: article?.seo_description || article?.excerpt,
    keywords: article?.tags || [],
    image: article?.featured_image,
    type: 'article'
  });

  useEffect(() => {
    if (article) {
      // Track page view and article engagement
      trackPageView(`/blog/${slug}`);
      trackEvent({
        event_type: 'article_view',
        page_path: `/blog/${slug}`,
        event_data: {
          article_id: article.id,
          article_title: article.title,
          category: article.category
        }
      });

      // Increment view count
      supabase
        .from('articles')
        .update({ views_count: (article.views_count || 0) + 1 })
        .eq('id', article.id)
        .then();
    }
  }, [article, slug, trackPageView, trackEvent]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Article not found</h1>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={article.seo_title || article.title}
        description={article.seo_description || article.excerpt}
        keywords={article.tags || []}
        image={article.featured_image}
        type="article"
      />
      <div className="min-h-screen bg-gradient-bg">
        <Navigation />
        
        <article className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <Breadcrumbs 
            items={[
              { label: 'Blog', href: '/blog' },
              { label: article.category, href: `/blog?category=${article.category}` },
              { label: article.title, current: true }
            ]}
            className="mb-8"
          />

          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              {article.is_featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {article.read_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.read_time} min
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.views_count}
              </div>
              
              <div className="ml-auto flex items-center gap-2">
                <ArticleReactions 
                  articleId={article.id} 
                  initialLikes={article.likes_count || 0}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {article.featured_image && (
            <img 
              src={article.featured_image} 
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Separator className="my-12" />

          <RelatedArticles currentArticleId={article.id} category={article.category} />

          <Separator className="my-12" />

          <CommentsSection articleId={article.id} />
        </article>
      </div>
    </>
  );
};

export default BlogPost;
