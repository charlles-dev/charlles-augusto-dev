import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, BarChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import ProjectsManager from "@/components/admin/ProjectsManager";
import ExperiencesManager from "@/components/admin/ExperiencesManager";
import EducationManager from "@/components/admin/EducationManager";
import ContactMessagesManager from "@/components/admin/ContactMessagesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { BlogManager } from '@/components/admin/BlogManager';
import { CommentsManager } from '@/components/admin/CommentsManager';
import { NewsletterManager } from '@/components/admin/NewsletterManager';
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você saiu da conta com sucesso.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Painel Admin</h1>
              <p className="text-muted-foreground">Gerenciar portfólio</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="experiences">Experiências</TabsTrigger>
            <TabsTrigger value="education">Educação</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="theme">Tema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsManager />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterManager />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
          
          <TabsContent value="experiences">
            <ExperiencesManager />
          </TabsContent>
          
          <TabsContent value="education">
            <EducationManager />
          </TabsContent>
          
          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>
          
          <TabsContent value="messages">
            <ContactMessagesManager />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeCustomizer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;