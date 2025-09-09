import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, GraduationCap, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  period: string;
  description?: string;
  location?: string;
  gpa?: string;
  display_order: number;
}

const EducationManager = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    period: "",
    description: "",
    location: "",
    gpa: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setEducations(data || []);
    } catch (error) {
      console.error('Error fetching education:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar formações acadêmicas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('education')
          .update({
            ...formData,
            display_order: Number(formData.display_order),
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Formação acadêmica atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('education')
          .insert([{
            ...formData,
            display_order: Number(formData.display_order),
          }]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Formação acadêmica criada com sucesso!",
        });
      }
      
      await fetchEducations();
      resetForm();
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar formação acadêmica.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (education: Education) => {
    setFormData({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study,
      period: education.period,
      description: education.description || "",
      location: education.location || "",
      gpa: education.gpa || "",
      display_order: education.display_order,
    });
    setEditingId(education.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta formação acadêmica?')) return;
    
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Formação acadêmica excluída com sucesso!",
      });
      
      await fetchEducations();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir formação acadêmica.",
        variant: "destructive",
      });
    }
  };

  const handleMoveUp = async (education: Education) => {
    const currentIndex = educations.findIndex(e => e.id === education.id);
    if (currentIndex <= 0) return;

    const previousEducation = educations[currentIndex - 1];
    
    try {
      await Promise.all([
        supabase.from('education').update({ display_order: previousEducation.display_order }).eq('id', education.id),
        supabase.from('education').update({ display_order: education.display_order }).eq('id', previousEducation.id)
      ]);
      
      await fetchEducations();
      toast({
        title: "Sucesso",
        description: "Ordem alterada com sucesso!",
      });
    } catch (error) {
      console.error('Error moving education up:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar ordem.",
        variant: "destructive",
      });
    }
  };

  const handleMoveDown = async (education: Education) => {
    const currentIndex = educations.findIndex(e => e.id === education.id);
    if (currentIndex >= educations.length - 1) return;

    const nextEducation = educations[currentIndex + 1];
    
    try {
      await Promise.all([
        supabase.from('education').update({ display_order: nextEducation.display_order }).eq('id', education.id),
        supabase.from('education').update({ display_order: education.display_order }).eq('id', nextEducation.id)
      ]);
      
      await fetchEducations();
      toast({
        title: "Sucesso",
        description: "Ordem alterada com sucesso!",
      });
    } catch (error) {
      console.error('Error moving education down:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar ordem.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      period: "",
      description: "",
      location: "",
      gpa: "",
      display_order: educations.length,
    });
    setEditingId(null);
    setDialogOpen(false);
  };

  const handleNewEducation = () => {
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      period: "",
      description: "",
      location: "",
      gpa: "",
      display_order: educations.length,
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Carregando formações acadêmicas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Formação Acadêmica
        </h2>
        <Button onClick={handleNewEducation}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Formação
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Formação Acadêmica" : "Nova Formação Acadêmica"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institution">Instituição</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="degree">Grau</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="Ex: Bacharelado, Mestrado, Certificação"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field_of_study">Área de Estudo</Label>
                <Input
                  id="field_of_study"
                  value={formData.field_of_study}
                  onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="period">Período</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                  placeholder="Ex: 2018 - 2022"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
              <div>
                <Label htmlFor="gpa">GPA/Nota</Label>
                <Input
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                  placeholder="Ex: 8.5/10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="display_order">Ordem de Exibição</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição opcional da formação..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {educations.map((education, index) => (
          <Card key={education.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {education.degree} em {education.field_of_study}
                  </CardTitle>
                  <p className="text-primary font-semibold">{education.institution}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{education.period}</span>
                    {education.location && <span>{education.location}</span>}
                    {education.gpa && <Badge variant="secondary">GPA: {education.gpa}</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveUp(education)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveDown(education)}
                    disabled={index === educations.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(education)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(education.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {education.description && (
              <CardContent>
                <p className="text-muted-foreground">{education.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationManager;