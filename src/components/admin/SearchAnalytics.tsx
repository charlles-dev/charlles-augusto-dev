import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SearchAnalytics: React.FC = () => {
  const { data: searchStats, isLoading } = useQuery({
    queryKey: ['search-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('search_term, results_count, created_at');

      if (error) throw error;

      // Group by search term and count occurrences
      const termCounts: Record<string, { count: number; avgResults: number }> = {};
      
      data.forEach((search) => {
        const term = search.search_term.toLowerCase();
        if (!termCounts[term]) {
          termCounts[term] = { count: 0, avgResults: 0 };
        }
        termCounts[term].count += 1;
        termCounts[term].avgResults += search.results_count;
      });

      // Calculate averages and sort by frequency
      const topSearches = Object.entries(termCounts)
        .map(([term, stats]) => ({
          term,
          count: stats.count,
          avgResults: Math.round(stats.avgResults / stats.count),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get recent searches (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentSearches = data.filter(
        s => new Date(s.created_at) >= sevenDaysAgo
      ).length;

      // Find searches with no results
      const zeroResultSearches = data
        .filter(s => s.results_count === 0)
        .map(s => s.search_term)
        .filter((term, index, self) => self.indexOf(term) === index)
        .slice(0, 5);

      return {
        topSearches,
        totalSearches: data.length,
        recentSearches,
        zeroResultSearches,
      };
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando analytics de busca...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Buscas</p>
                <p className="text-2xl font-bold">{searchStats?.totalSearches || 0}</p>
              </div>
              <Search className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Últimos 7 Dias</p>
                <p className="text-2xl font-bold">{searchStats?.recentSearches || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Termos Únicos</p>
                <p className="text-2xl font-bold">{searchStats?.topSearches.length || 0}</p>
              </div>
              <Badge variant="secondary" className="text-lg">
                Top 10
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Searches Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Termos Mais Buscados</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={searchStats?.topSearches || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="term" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Zero Results Searches */}
      {searchStats?.zeroResultSearches && searchStats.zeroResultSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Buscas Sem Resultados</CardTitle>
            <p className="text-sm text-muted-foreground">
              Estes termos não retornaram resultados. Considere criar conteúdo sobre eles.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchStats.zeroResultSearches.map((term, index) => (
                <Badge key={index} variant="destructive">
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
