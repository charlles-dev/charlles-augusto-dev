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

export const AdminProjects: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { duplicateItem, bulkUpdate, bulkDelete } = useAdminActions('projects');

  const fetchProjects = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
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

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleDuplicate = async (ids: string[]) => {
    for (const id of ids) {
      await duplicateItem(id);
    }
    await fetchProjects();
    setSelectedProjects([]);
  };

  const handlePublish = async (ids: string[]) => {
    await bulkUpdate(ids, { status: 'published' });
    await fetchProjects();
    setSelectedProjects([]);
  };

  const handleUnpublish = async (ids: string[]) => {
    await bulkUpdate(ids, { status: 'draft' });
    await fetchProjects();
    setSelectedProjects([]);
  };

  const handleMarkFeatured = async (ids: string[]) => {
    await bulkUpdate(ids, { is_featured: true });
    await fetchProjects();
    setSelectedProjects([]);
  };

  const handleRemoveFeatured = async (ids: string[]) => {
    await bulkUpdate(ids, { is_featured: false });
    await fetchProjects();
    setSelectedProjects([]);
  };

  const handleDelete = async (ids: string[]) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      await bulkDelete(ids);
      await fetchProjects();
      setSelectedProjects([]);
    }
  };

  if (loading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.manageProjects')}</h1>
        <Button onClick={() => setShowForm(true)}>
          {t('admin.addNew')}
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="mb-4 flex items-center gap-4">
          <Checkbox
            checked={selectedProjects.length === projects.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm">
            {selectedProjects.length} {t('admin.selected')}
          </span>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-4">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={() => handleSelectProject(project.id)}
            />
            <div className="flex-1">
              <ProjectCard
                project={project}
                onEdit={() => {
                  setEditingProject(project);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete([project.id])}
              />
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t('projects.empty')}
        </div>
      )}

      <BulkActionsBar
        selectedItems={selectedProjects}
        onDuplicate={handleDuplicate}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onMarkFeatured={handleMarkFeatured}
        onRemoveFeatured={handleRemoveFeatured}
        onDelete={handleDelete}
      />

      {showForm && (
        <ItemForm
          type="projects"
          item={editingProject}
          onSuccess={() => {
            fetchProjects();
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};