import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SortableItem {
  id: string;
  display_order: number;
  [key: string]: any;
}

interface UseSortableDataOptions {
  tableName: 'projects' | 'education' | 'experiences';
  queryKey: string[];
  onUpdate?: (items: SortableItem[]) => void;
}

export function useSortableData({
  tableName,
  queryKey,
  onUpdate,
}: UseSortableDataOptions) {
  const queryClient = useQueryClient();

  const updateOrderMutation = useMutation({
    mutationFn: async (items: SortableItem[]) => {
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from(tableName)
        .upsert(updates as any);

      if (error) throw error;
      return items;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Ordem atualizada com sucesso!');
      onUpdate?.(data);
    },
    onError: (error) => {
      toast.error('Erro ao atualizar ordem');
      console.error('Error updating order:', error);
    },
  });

  const handleReorder = useCallback((items: SortableItem[]) => {
    const itemsWithOrder = items.map((item, index) => ({
      ...item,
      display_order: index,
    }));
    
    updateOrderMutation.mutate(itemsWithOrder);
  }, [updateOrderMutation]);

  return {
    handleReorder,
    isUpdating: updateOrderMutation.isPending,
  };
}