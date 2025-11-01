import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, Heart, MessageSquare, TrendingUp, Calendar } from 'lucide-react';

export const BlogStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const [articles, comments, reactions] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact' }),
        supabase.from('article_comments').select('*', { count: 'exact' }),
        supabase.from('article_reactions').select('*', { count: 'exact' })
      ]);

      const totalViews = articles.data?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0;
      const totalLikes = articles.data?.reduce((sum, a) => sum + (a.likes_count || 0), 0) || 0;
      const publishedCount = articles.data?.filter(a => a.is_published).length || 0;
      const draftCount = (articles.count || 0) - publishedCount;

      // Calculate engagement rate
      const engagementRate = totalViews > 0 
        ? ((totalLikes + (comments.count || 0)) / totalViews * 100).toFixed(1)
        : '0.0';

      // Get most viewed article
      const mostViewed = articles.data?.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))[0];

      return {
        total: articles.count || 0,
        published: publishedCount,
        drafts: draftCount,
        totalViews,
        totalLikes,
        totalComments: comments.count || 0,
        engagementRate,
        mostViewed: mostViewed?.title || 'N/A',
        mostViewedCount: mostViewed?.views_count || 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const statCards = [
    {
      title: 'Total de Artigos',
      value: stats?.total || 0,
      icon: FileText,
      description: `${stats?.published || 0} publicados, ${stats?.drafts || 0} rascunhos`
    },
    {
      title: 'Total de Visualizações',
      value: stats?.totalViews || 0,
      icon: Eye,
      description: 'Todas os artigos'
    },
    {
      title: 'Total de Likes',
      value: stats?.totalLikes || 0,
      icon: Heart,
      description: 'Reações positivas'
    },
    {
      title: 'Comentários',
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      description: 'Total de comentários'
    },
    {
      title: 'Taxa de Engajamento',
      value: `${stats?.engagementRate || 0}%`,
      icon: TrendingUp,
      description: 'Likes + Comentários / Views'
    },
    {
      title: 'Mais Visto',
      value: stats?.mostViewedCount || 0,
      icon: Calendar,
      description: stats?.mostViewed || 'N/A',
      className: 'col-span-2'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={stat.className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
