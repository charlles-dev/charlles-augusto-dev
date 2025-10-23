import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

interface RelatedArticlesProps {
  currentArticleId: string;
  category: string;
}

export const RelatedArticles = ({ currentArticleId, category }: RelatedArticlesProps) => {
  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', currentArticleId, category],
    queryFn: async () => {
      // Fetch articles from same category, ordered by views and likes
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .eq('is_published', true)
        .neq('id', currentArticleId)
        .order('views_count', { ascending: false })
        .order('likes_count', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Artigos Relacionados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link key={article.id} to={`/blog/${article.slug}`}>
            <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
              {article.featured_image && (
                <div className="overflow-hidden rounded-t-lg">
                  <img 
                    src={article.featured_image} 
                    alt={article.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {article.category}
                </Badge>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  {article.read_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.read_time} min
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
