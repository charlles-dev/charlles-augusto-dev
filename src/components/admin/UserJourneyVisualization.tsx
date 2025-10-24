import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { format } from 'date-fns';

interface JourneyStep {
  page_path: string;
  timestamp: string;
  event_type: string;
}

interface UserSession {
  session_id: string;
  steps: JourneyStep[];
  duration: number;
}

export const UserJourneyVisualization = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['user-journeys'],
    queryFn: async () => {
      // Get recent sessions
      const { data: events } = await supabase
        .from('analytics_events')
        .select('session_id, page_path, created_at, event_type')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (!events) return [];

      // Group by session
      const sessionMap = new Map<string, JourneyStep[]>();
      events.forEach(event => {
        if (!sessionMap.has(event.session_id)) {
          sessionMap.set(event.session_id, []);
        }
        sessionMap.get(event.session_id)!.push({
          page_path: event.page_path || '',
          timestamp: event.created_at,
          event_type: event.event_type
        });
      });

      // Convert to array and calculate duration
      const sessions: UserSession[] = Array.from(sessionMap.entries())
        .map(([session_id, steps]) => {
          const sortedSteps = steps.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          const duration = sortedSteps.length > 1
            ? (new Date(sortedSteps[sortedSteps.length - 1].timestamp).getTime() - 
               new Date(sortedSteps[0].timestamp).getTime()) / 1000 / 60 // in minutes
            : 0;
          return {
            session_id,
            steps: sortedSteps,
            duration
          };
        })
        .filter(s => s.steps.length > 1) // Only sessions with multiple steps
        .sort((a, b) => b.steps.length - a.steps.length)
        .slice(0, 20);

      return sessions;
    }
  });

  // Calculate common paths
  const commonPaths = sessions?.reduce((acc, session) => {
    if (session.steps.length < 2) return acc;
    
    for (let i = 0; i < session.steps.length - 1; i++) {
      const from = session.steps[i].page_path;
      const to = session.steps[i + 1].page_path;
      const path = `${from} → ${to}`;
      acc[path] = (acc[path] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topPaths = Object.entries(commonPaths || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  if (isLoading) {
    return <div className="text-center py-8">Loading user journeys...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="paths" className="space-y-4">
        <TabsList>
          <TabsTrigger value="paths">Common Paths</TabsTrigger>
          <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Common Navigation Paths</CardTitle>
              <CardDescription>How users navigate through your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPaths.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-mono">{item.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.count}</span>
                      <span className="text-xs text-muted-foreground">times</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Path Flow Visualization</CardTitle>
              <CardDescription>Visual representation of user flows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPaths.slice(0, 5).map((item, index) => {
                  const [from, to] = item.path.split(' → ');
                  const maxCount = topPaths[0].count;
                  const width = (item.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex-1 text-right font-medium truncate">{from}</div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 font-medium truncate">{to}</div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {item.count} users
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Sessions</CardTitle>
              <CardDescription>Individual user journeys through the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions?.slice(0, 10).map((session, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Session {index + 1}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.steps.length} pages • {session.duration.toFixed(1)} min
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {session.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {stepIndex < session.steps.length - 1 && (
                              <div className="w-0.5 h-8 bg-border" />
                            )}
                          </div>
                          <div className="flex-1 pt-0">
                            <div className="text-sm font-medium">{step.page_path}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(step.timestamp), 'HH:mm:ss')}
                            </div>
                          </div>
                        </div>
                      ))}
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
