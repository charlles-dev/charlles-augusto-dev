import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SortableList } from '@/components/admin/SortableList';
import { useSortableData } from '@/hooks/use-sortable-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { SortableItem } from '@/types/db';

interface OrderManagerProps {
  type: 'projects' | 'education' | 'experiences';
}

const OrderManager: React.FC<OrderManagerProps> = ({ type }) => {
  const [items, setItems] = useState<SortableItem[]>([]);

  const getSelectQuery = (type: 'projects' | 'education' | 'experiences') => {
    switch (type) {
      case 'projects':
        return 'id, display_order, name';
      case 'education':
        return 'id, display_order, degree, institution';
      case 'experiences':
        return 'id, display_order, title, company';
    }
  };

  const { data: rawItems, isLoading } = useQuery({
    queryKey: [type, 'order'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type)
        .select(getSelectQuery(type))
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as unknown as SortableItem[];
    },
  });

  const { handleReorder, isUpdating } = useSortableData({
    tableName: type,
    queryKey: [type, 'order'],
    onUpdate: setItems,
  });

  React.useEffect(() => {
    if (rawItems) {
      setItems(rawItems);
    }
  }, [rawItems]);

  const renderItem = (item: SortableItem, index: number) => (
    <div className="flex items-center justify-between flex-1">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          #{index + 1}
        </span>
        <div>
          <p className="font-medium">
            {item.name || item.title || item.degree}
          </p>
          <p className="text-sm text-muted-foreground">
            {item.institution || item.company}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {item.status && (
          <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        )}
        {item.is_featured && (
          <Badge variant="outline" className="bg-yellow-50">
            Destaque
          </Badge>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Ordenar {type === 'projects' ? 'Projetos' : type === 'education' ? 'Educação' : 'Experiências'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Arraste e solte os itens para reordená-los. A mudança será salva automaticamente.
          </p>
          
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={renderItem}
          />

          {isUpdating && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Salvando...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManager;