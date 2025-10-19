import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .eq('is_published', true);
      
      if (error) throw error;
      return [...new Set(data.map(a => a.category))];
    },
  });

  return (
    <>
      <SEO 
        title="Blog"
        description="Articles, tutorials and insights about web development, design and technology"
        type="blog"
      />
      <div className="min-h-screen bg-gradient-bg">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Blog</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('blog.subtitle', 'Articles, tutorials and insights')}
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('blog.search', 'Search articles...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                {t('blog.all', 'All')}
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : articles?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('blog.noArticles', 'No articles found')}</p>
              </div>
            ) : (
              articles?.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    {article.featured_image && (
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        {article.is_featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
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
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {article.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
