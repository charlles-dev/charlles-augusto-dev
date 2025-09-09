import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ExternalLink, Github, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    github: "",
    demo: "",
    image: "",
    display_order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar projetos",
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
      const projectData = {
        name: formData.name,
        description: formData.description,
        technologies: formData.technologies.split(",").map(t => t.trim()),
        github: formData.github || null,
        demo: formData.demo || null,
        image: formData.image || null,
        display_order: Number(formData.display_order),
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        
        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);

        if (error) throw error;
        
        toast({
          title: "Projeto criado",
          description: "O projeto foi criado com sucesso.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar projeto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      technologies: project.technologies.join(", "),
      github: project.github || "",
      demo: project.demo || "",
      image: project.image || "",
      display_order: project.display_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso.",
      });
      
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir projeto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMoveUp = async (project: Project) => {
    const currentIndex = projects.findIndex(p => p.id === project.id);
    if (currentIndex <= 0) return;

    const previousProject = projects[currentIndex - 1];
    
    try {
      await Promise.all([
        supabase.from('projects').update({ display_order: previousProject.display_order }).eq('id', project.id),
        supabase.from('projects').update({ display_order: project.display_order }).eq('id', previousProject.id)
      ]);
      
      await fetchProjects();
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

  const handleMoveDown = async (project: Project) => {
    const currentIndex = projects.findIndex(p => p.id === project.id);
    if (currentIndex >= projects.length - 1) return;

    const nextProject = projects[currentIndex + 1];
    
    try {
      await Promise.all([
        supabase.from('projects').update({ display_order: nextProject.display_order }).eq('id', project.id),
        supabase.from('projects').update({ display_order: project.display_order }).eq('id', nextProject.id)
      ]);
      
      await fetchProjects();
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      technologies: "",
      github: "",
      demo: "",
      image: "",
      display_order: projects.length
    });
    setEditingProject(null);
  };

  const handleNewProject = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando projetos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gerenciar Projetos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewProject}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Editar Projeto" : "Novo Projeto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <Label htmlFor="technologies">Tecnologias (separadas por vírgula)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="React, Node.js, PostgreSQL"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL (opcional)</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({...formData, github: e.target.value})}
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo">Demo URL (opcional)</Label>
                <Input
                  id="demo"
                  type="url"
                  value={formData.demo}
                  onChange={(e) => setFormData({...formData, demo: e.target.value})}
                  placeholder="https://demo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Imagem URL (opcional)</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
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
                  {editingProject ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="group bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMoveUp(project)}
                    disabled={projects.findIndex(p => p.id === project.id) === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMoveDown(project)}
                    disabled={projects.findIndex(p => p.id === project.id) === projects.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                {project.github && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;