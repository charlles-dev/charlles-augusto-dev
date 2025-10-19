import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { CommentsSection } from '@/components/blog/CommentsSection';
import { RelatedArticles } from '@/components/blog/RelatedArticles';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (article) {
      // Increment view count
      supabase
        .from('articles')
        .update({ views_count: (article.views_count || 0) + 1 })
        .eq('id', article.id)
        .then();
    }
  }, [article]);

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
        keywords={article.tags?.join(', ')}
        image={article.featured_image}
        type="article"
      />
      <div className="min-h-screen bg-gradient-bg">
        <Navigation />
        
        <article className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

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
                {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {article.read_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.read_time} min read
                </div>
              )}
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {article.views_count} views
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
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
