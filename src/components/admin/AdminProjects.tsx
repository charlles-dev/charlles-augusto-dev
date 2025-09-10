import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/db';
import { ItemForm } from './ItemForm';
import { ProjectCard } from './ProjectCard';
import { BulkActionsBar } from './BulkActionsBar';
import { useAdminActions } from '@/hooks/useAdminActions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { SortableList } from '@/components/admin/SortableList';
import { useSortableData } from '@/hooks/use-sortable-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { duplicateItem, bulkUpdate, bulkDelete } = useAdminActions('projects');
  const { handleReorder } = useSortableData({
    tableName: 'projects',
    queryKey: ['projects'],
    onUpdate: (items) => {
      // Convert SortableItem[] to Project[]
      const updatedProjects = items.map(item => {
        const project = projects.find(p => p.id === item.id);
        return project || null;
      }).filter(Boolean) as Project[];
      setProjects(updatedProjects);
    },
  });

  const fetchProjects = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      // Ensure all required Project properties are present
      const projectsWithDefaults = data.map(project => ({
        ...project,
        is_featured: project.is_featured || false,
        status: project.status || 'published',
      }));
      setProjects(projectsWithDefaults);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedProjects(projects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleAction = async (action: Function, ids: string[]) => {
    await action(ids);
    await fetchProjects();
    setSelectedProjects([]);
  };

  const openNewForm = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  if (loading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gerenciar Projetos</h2>
        <Button onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
          <Checkbox
            checked={selectedProjects.length > 0 && selectedProjects.length === projects.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedProjects.length} de {projects.length} selecionado(s)
          </span>
        </div>
      )}

      <SortableList
        items={projects}
        onReorder={handleReorder}
        renderItem={(project) => (
          <div className="flex items-center gap-4 w-full">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={() => handleSelectProject(project.id)}
            />
            <div className="flex-1">
              <ProjectCard
                project={project}
                onEdit={() => openEditForm(project)}
                onDelete={() => handleAction(bulkDelete, [project.id])}
              />
            </div>
          </div>
        )}
      />

      {projects.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">{t('projects.empty')}</h3>
          <p className="text-sm text-muted-foreground mt-1">Comece adicionando um novo projeto.</p>
        </div>
      )}

      <BulkActionsBar
        selectedItems={selectedProjects}
        onDuplicate={(ids) => handleAction(duplicateItem, ids)}
        onPublish={(ids) => handleAction((ids) => bulkUpdate(ids, { status: 'published' }), ids)}
        onUnpublish={(ids) => handleAction((ids) => bulkUpdate(ids, { status: 'draft' }), ids)}
        onMarkFeatured={(ids) => handleAction((ids) => bulkUpdate(ids, { is_featured: true }), ids)}
        onRemoveFeatured={(ids) => handleAction((ids) => bulkUpdate(ids, { is_featured: false }), ids)}
        onDelete={(ids) => handleAction(bulkDelete, ids)}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Editar Projeto" : "Novo Projeto"}
            </DialogTitle>
          </DialogHeader>
          <ItemForm
            type="projects"
            item={editingProject}
            onSuccess={() => {
              fetchProjects();
              setIsFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};