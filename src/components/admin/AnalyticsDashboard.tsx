import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, MousePointerClick, TrendingUp, Users, Clock, ExternalLink } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface AnalyticsMetrics {
  totalViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  topArticles: Array<{ title: string; views: number; likes: number }>;
  trafficSources: Array<{ source: string; count: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const AnalyticsDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['analytics-metrics'],
    queryFn: async () => {
      const last30Days = subDays(new Date(), 30).toISOString();

      // Total page views
      const { count: totalViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('created_at', last30Days);

      // Unique visitors (unique session_ids)
      const { data: sessions } = await supabase
        .from('analytics_events')
        .select('session_id')
        .eq('event_type', 'page_view')
        .gte('created_at', last30Days);
      const uniqueVisitors = new Set(sessions?.map(s => s.session_id)).size;

      // Top pages
      const { data: pageViews } = await supabase
        .from('analytics_events')
        .select('page_path')
        .eq('event_type', 'page_view')
        .gte('created_at', last30Days);
      
      const pageCounts = pageViews?.reduce((acc, { page_path }) => {
        acc[page_path] = (acc[page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPages = Object.entries(pageCounts || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([page, views]) => ({ page, views }));

      // Top articles with views and likes
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, views_count, likes_count')
        .eq('is_published', true)
        .order('views_count', { ascending: false })
        .limit(10);

      const topArticles = articles?.map(a => ({
        title: a.title,
        views: a.views_count,
        likes: a.likes_count
      })) || [];

      // Traffic sources (from referrer)
      const { data: referrers } = await supabase
        .from('analytics_events')
        .select('referrer')
        .eq('event_type', 'page_view')
        .gte('created_at', last30Days);

      const sourceCounts = referrers?.reduce((acc, { referrer }) => {
        try {
          if (referrer) {
            const url = new URL(referrer);
            const source = url.hostname || 'Direct';
            acc[source] = (acc[source] || 0) + 1;
          } else {
            acc['Direct'] = (acc['Direct'] || 0) + 1;
          }
        } catch (e) {
          // Invalid URL, count as Direct
          acc['Direct'] = (acc['Direct'] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const trafficSources = Object.entries(sourceCounts || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([source, count]) => ({ source, count }));

      // Daily views for the last 7 days
      const { data: dailyEvents } = await supabase
        .from('analytics_events')
        .select('created_at')
        .eq('event_type', 'page_view')
        .gte('created_at', subDays(new Date(), 7).toISOString());

      const dailyCounts = dailyEvents?.reduce((acc, { created_at }) => {
        const date = format(startOfDay(new Date(created_at)), 'MMM dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dailyViews = Object.entries(dailyCounts || {})
        .map(([date, views]) => ({ date, views }));

      // Calculate bounce rate (sessions with only 1 page view)
      const { data: sessionEvents } = await supabase
        .from('analytics_events')
        .select('session_id')
        .eq('event_type', 'page_view')
        .gte('created_at', last30Days);

      const sessionCounts = sessionEvents?.reduce((acc, { session_id }) => {
        acc[session_id] = (acc[session_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const bouncedSessions = Object.values(sessionCounts || {}).filter(count => count === 1).length;
      const bounceRate = uniqueVisitors > 0 ? (bouncedSessions / uniqueVisitors) * 100 : 0;

      return {
        totalViews: totalViews || 0,
        uniqueVisitors,
        avgSessionDuration: 0, // Would need timestamp tracking for this
        bounceRate: Math.round(bounceRate),
        topPages,
        topArticles,
        trafficSources,
        dailyViews
      } as AnalyticsMetrics;
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">Single page sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.uniqueVisitors > 0 
                ? (metrics.totalViews / metrics.uniqueVisitors).toFixed(1)
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Pages per visitor</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Views Trend</CardTitle>
              <CardDescription>Page views over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics?.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics?.topPages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Articles</CardTitle>
              <CardDescription>Most viewed and liked articles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metrics?.topArticles} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
                  <Bar dataKey="likes" fill="hsl(var(--secondary))" name="Likes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Article Engagement</CardTitle>
                <CardDescription>Average likes per view</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics?.topArticles.slice(0, 5).map((article, index) => {
                    const engagementRate = article.views > 0 
                      ? ((article.likes / article.views) * 100).toFixed(1)
                      : '0';
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1">{article.title}</span>
                        <span className="text-sm font-bold ml-2">{engagementRate}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Engagement</CardTitle>
                <CardDescription>Views vs Likes comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Views', value: metrics?.topArticles.reduce((sum, a) => sum + a.views, 0) || 0 },
                        { name: 'Likes', value: (metrics?.topArticles.reduce((sum, a) => sum + a.likes, 0) || 0) * 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics?.trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="count"
                  >
                    {metrics?.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Details</CardTitle>
              <CardDescription>Top referral sources breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{source.count}</div>
                      <div className="text-xs text-muted-foreground">
                        {((source.count / (metrics?.totalViews || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
