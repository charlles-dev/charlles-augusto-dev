import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useAdminActions = (table: 'projects' | 'education' | 'experiences' | 'articles') => {
  const { t } = useTranslation();

  const duplicateItem = useCallback(async (id: string) => {
    try {
      const { data: originalItem, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newRecord: any = {
        ...originalItem,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
        display_order: originalItem.display_order + 1,
      };

      if ('name' in newRecord) {
        newRecord.name = `${newRecord.name} (Cópia)`;
      }
      if ('title' in newRecord) {
        newRecord.title = `${newRecord.title} (Cópia)`;
      }

      const { error: insertError } = await supabase
        .from(table)
        .insert([newRecord]);

      if (insertError) throw insertError;

      toast.success(t('admin.duplicateSuccess'));
    } catch (error) {
      console.error('Error duplicating item:', error);
      toast.error(t('common.errorOccurred'));
    }
  }, [table, t]);

  const bulkUpdate = useCallback(async (ids: string[], updates: any) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      toast.success(t('common.saveSuccess'));
    } catch (error) {
      console.error('Error bulk updating:', error);
      toast.error(t('common.errorOccurred'));
    }
  }, [table, t]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .in('id', ids);

      if (error) throw error;

      toast.success(t('common.deleteSuccess'));
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error(t('common.errorOccurred'));
    }
  }, [table, t]);

  return {
    duplicateItem,
    bulkUpdate,
    bulkDelete,
  };
};