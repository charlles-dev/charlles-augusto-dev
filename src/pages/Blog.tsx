import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogSearch, SearchFilters } from '@/components/ui/blog-search';
import { BlogSkeletonList } from '@/components/loading/BlogSkeleton';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ARTICLES_PER_PAGE = 6;

const Blog = () => {
  const { t } = useTranslation();
  const { trackPageView } = useAnalytics();
  
  // Save filters to localStorage
  const [savedFilters, setSavedFilters] = useLocalStorage<SearchFilters>('blog-filters', {
    tags: [],
    sortBy: 'recent',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(savedFilters);

  useEffect(() => {
    trackPageView('/blog');
  }, [trackPageView]);

  useEffect(() => {
    setSavedFilters(filters);
  }, [filters, setSavedFilters]);

  // Infinite scroll query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['articles', searchQuery, filters],
    queryFn: async ({ pageParam = 0 }) => {
      // Track search if there's a query
      if (searchQuery) {
        await supabase.from('search_analytics').insert({
          search_term: searchQuery,
          results_count: 0, // Will be updated after we get results
        });
      }

      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .range(pageParam, pageParam + ARTICLES_PER_PAGE - 1);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'popular':
          query = query.order('views_count', { ascending: false });
          break;
        case 'relevant':
          query = query.order('is_featured', { ascending: false });
          break;
        default:
          query = query.order('published_at', { ascending: false });
      }

      const { data, error, count } = await query;
      if (error) throw error;
      
      // Update search analytics with results count
      if (searchQuery && count !== null) {
        await supabase.from('search_analytics').insert({
          search_term: searchQuery,
          results_count: count,
        });
      }
      
      return { data, count };
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length * ARTICLES_PER_PAGE;
      return lastPage.count && nextPage < lastPage.count ? nextPage : undefined;
    },
    initialPageParam: 0,
    retry: 2, // Retry failed requests twice
  });

  const articles = data?.pages.flatMap(page => page.data) || [];
  
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: () => fetchNextPage(),
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage
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

  const { data: allTags } = useQuery({
    queryKey: ['all-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('tags')
        .eq('is_published', true);
      
      if (error) throw error;
      const tags = data.flatMap(a => a.tags || []);
      return [...new Set(tags)];
    },
  });

  const handleSearch = (query: string, newFilters: SearchFilters) => {
    setSearchQuery(query);
    setFilters(newFilters);
  };

  return (
    <>
      <SEO 
        title="Blog"
        description="Articles, tutorials and insights about web development, design and technology"
        type="website"
      />
      <div className="min-h-screen bg-gradient-bg">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Blog</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('blog.subtitle', 'Articles, tutorials and insights')}
            </p>

            <BlogSearch 
              onSearch={handleSearch}
              categories={categories || []}
              tags={allTags || []}
            />
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading ? (
              <BlogSkeletonList count={6} />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Erro ao carregar artigos</p>
                <button 
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Tentar novamente
                </button>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('blog.noArticles', 'No articles found')}</p>
              </div>
            ) : (
              <>
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${article.slug}`}>
                      <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
                        {article.featured_image && (
                          <div className="overflow-hidden">
                            <img 
                              src={article.featured_image} 
                              alt={article.title}
                              className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary">{article.category}</Badge>
                            {article.is_featured && (
                              <Badge variant="default">Featured</Badge>
                            )}
                          </div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
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
                  </motion.div>
                ))}
                
                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="py-8">
                  {isFetchingNextPage && (
                    <BlogSkeletonList count={3} />
                  )}
                  {!hasNextPage && articles.length > 0 && (
                    <p className="text-center text-muted-foreground">
                      {t('blog.noMoreArticles', 'No more articles to load')}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
