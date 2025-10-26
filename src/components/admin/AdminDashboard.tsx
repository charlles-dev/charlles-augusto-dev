import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminStats from './AdminStats';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { UserJourneyVisualization } from './UserJourneyVisualization';
import { Bell, Settings, Download, RefreshCw, Filter, Eye, Heart, FileText, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const [
        { data: recentMessages },
        { data: recentTestimonials },
        { data: recentSubscribers },
        { data: articlesStats }
      ] = await Promise.all([
        supabase.from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase.from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false })
          .limit(5),
        supabase.from('articles')
          .select('views_count, likes_count')
      ]);

      const totalViews = articlesStats?.reduce((sum, article) => sum + article.views_count, 0) || 0;
      const totalLikes = articlesStats?.reduce((sum, article) => sum + article.likes_count, 0) || 0;
      const totalArticles = articlesStats?.length || 0;
      const avgEngagement = totalArticles > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : '0';

      return {
        messages: recentMessages || [],
        testimonials: recentTestimonials || [],
        subscribers: recentSubscribers || [],
        blogStats: {
          totalViews,
          totalLikes,
          totalArticles,
          avgEngagement,
        },
      };
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh all queries
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Gerencie seu portfólio e acompanhe métricas importantes
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <AdminStats />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="journey">Jornada</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Blog Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Views</p>
                      <p className="text-2xl font-bold">
                        {recentActivity?.blogStats.totalViews.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Likes</p>
                      <p className="text-2xl font-bold">
                        {recentActivity?.blogStats.totalLikes.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-destructive opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Artigos</p>
                      <p className="text-2xl font-bold">
                        {recentActivity?.blogStats.totalArticles || '0'}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-accent opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Engajamento</p>
                      <p className="text-2xl font-bold">
                        {recentActivity?.blogStats.avgEngagement || '0'}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Messages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Mensagens Recentes</CardTitle>
                <Badge variant="secondary">
                  {recentActivity?.messages.length || 0}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  recentActivity?.messages.slice(0, 5).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {message.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.subject}
                        </p>
                      </div>
                      <Badge 
                        variant={message.status === 'read' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {message.status}
                      </Badge>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Testimonials */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Depoimentos Recentes</CardTitle>
                <Badge variant="secondary">
                  {recentActivity?.testimonials.length || 0}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  recentActivity?.testimonials.map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {testimonial.client_name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {testimonial.content}
                        </p>
                      </div>
                      <Badge 
                        variant={testimonial.is_approved ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {testimonial.status}
                      </Badge>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Newsletter Subscribers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assinantes da Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activityLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))
                ) : (
                  recentActivity?.subscribers.slice(0, 6).map((subscriber) => (
                    <motion.div
                      key={subscriber.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {subscriber.name || 'Sem nome'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {subscriber.email}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade de gerenciamento de mensagens será implementada aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Depoimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade de gerenciamento de depoimentos será implementada aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="journey">
          <UserJourneyVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;