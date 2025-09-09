import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  period: string;
  location?: string;
  technologies: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

const ExperiencesManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    period: "",
    location: "",
    technologies: "",
    display_order: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar experiências",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const experienceData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        period: formData.period,
        location: formData.location || null,
        technologies: formData.technologies ? formData.technologies.split(",").map(t => t.trim()) : [],
        display_order: Number(formData.display_order),
      };

      if (editingExperience) {
        const { error } = await supabase
          .from("experiences")
          .update(experienceData)
          .eq("id", editingExperience.id);

        if (error) throw error;
        
        toast({
          title: "Experiência atualizada",
          description: "A experiência foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("experiences")
          .insert([experienceData]);

        if (error) throw error;
        
        toast({
          title: "Experiência criada",
          description: "A experiência foi criada com sucesso.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar experiência",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      description: experience.description,
      period: experience.period,
      location: experience.location || "",
      technologies: experience.technologies.join(", "),
      display_order: experience.display_order
    });
    setIsDialogOpen(true);
  };

  const handleMoveUp = async (experience: Experience) => {
    const currentIndex = experiences.findIndex(e => e.id === experience.id);
    if (currentIndex <= 0) return;

    const previousExperience = experiences[currentIndex - 1];
    
    try {
      await Promise.all([
        supabase.from('experiences').update({ display_order: previousExperience.display_order }).eq('id', experience.id),
        supabase.from('experiences').update({ display_order: experience.display_order }).eq('id', previousExperience.id)
      ]);
      
      await fetchExperiences();
      toast({
        title: "Sucesso",
        description: "Ordem alterada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar ordem",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMoveDown = async (experience: Experience) => {
    const currentIndex = experiences.findIndex(e => e.id === experience.id);
    if (currentIndex >= experiences.length - 1) return;

    const nextExperience = experiences[currentIndex + 1];
    
    try {
      await Promise.all([
        supabase.from('experiences').update({ display_order: nextExperience.display_order }).eq('id', experience.id),
        supabase.from('experiences').update({ display_order: experience.display_order }).eq('id', nextExperience.id)
      ]);
      
      await fetchExperiences();
      toast({
        title: "Sucesso",
        description: "Ordem alterada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar ordem",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta experiência?")) return;
    
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Experiência excluída",
        description: "A experiência foi excluída com sucesso.",
      });
      
      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir experiência",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      description: "",
      period: "",
      location: "",
      technologies: "",
      display_order: experiences.length
    });
    setEditingExperience(null);
  };

  const handleNewExperience = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando experiências...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gerenciar Experiências</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewExperience}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Experiência
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Editar Experiência" : "Nova Experiência"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Cargo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  placeholder="2022 - Presente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização (opcional)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="São Paulo, SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technologies">Tecnologias (separadas por vírgula - opcional)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="Python, React, PostgreSQL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: Number(e.target.value)})}
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingExperience ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {experiences.map((experience) => (
          <Card key={experience.id} className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{experience.title}</CardTitle>
                  <p className="text-primary font-semibold">{experience.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {experience.period} • {experience.location}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMoveUp(experience)}
                    disabled={experiences.findIndex(e => e.id === experience.id) === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMoveDown(experience)}
                    disabled={experiences.findIndex(e => e.id === experience.id) === experiences.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(experience)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {experience.description}
              </p>
              {experience.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExperiencesManager;