import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { TrendingUp, Users, Mail, Star, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: projectsCount },
        { count: messagesCount },
        { count: testimonialsCount },
        { count: subscribersCount },
        { data: analyticsData }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_events')
          .select('event_type, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const totalViews = analyticsData?.filter(event => 
        event.event_type === 'page_view'
      ).length || 0;

      return {
        projects: projectsCount || 0,
        messages: messagesCount || 0,
        testimonials: testimonialsCount || 0,
        subscribers: subscribersCount || 0,
        views: totalViews,
      };
    },
  });

  const statCards = [
    {
      title: 'Total de Projetos',
      value: stats?.projects || 0,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Mensagens Recebidas',
      value: stats?.messages || 0,
      icon: Mail,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Depoimentos',
      value: stats?.testimonials || 0,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Assinantes Newsletter',
      value: stats?.subscribers || 0,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Visualizações (30 dias)',
      value: stats?.views || 0,
      icon: Eye,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <AnimatedCounter
                  end={stat.value}
                  duration={2}
                  className="text-2xl font-bold text-foreground"
                />
              </CardContent>
              
              {/* Background decoration */}
              <motion.div
                className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${stat.bgColor} opacity-20`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminStats;