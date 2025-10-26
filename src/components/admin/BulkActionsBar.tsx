import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Copy,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Trash2,
  Download,
  Archive,
  FolderOpen,
} from 'lucide-react';

interface BulkActionsBarProps {
  selectedItems: string[];
  onDuplicate: (ids: string[]) => void;
  onPublish: (ids: string[]) => void;
  onUnpublish: (ids: string[]) => void;
  onMarkFeatured: (ids: string[]) => void;
  onRemoveFeatured: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onExport?: (ids: string[]) => void;
  onArchive?: (ids: string[]) => void;
  onChangeCategory?: (ids: string[], category: string) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedItems,
  onDuplicate,
  onPublish,
  onUnpublish,
  onMarkFeatured,
  onRemoveFeatured,
  onDelete,
  onExport,
  onArchive,
  onChangeCategory,
}) => {
  const { t } = useTranslation();

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-2 flex items-center gap-2">
        <span className="text-sm font-medium px-2">
          {selectedItems.length} {t('admin.selected')}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDuplicate(selectedItems)}
          className="h-8 px-2"
        >
          <Copy className="h-4 w-4 mr-1" />
          {t('admin.duplicate')}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onPublish(selectedItems)}>
              <Eye className="h-4 w-4 mr-2" />
              {t('admin.publish')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUnpublish(selectedItems)}>
              <EyeOff className="h-4 w-4 mr-2" />
              {t('admin.unpublish')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkFeatured(selectedItems)}>
              <Star className="h-4 w-4 mr-2" />
              {t('admin.markAsFeatured')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemoveFeatured(selectedItems)}>
              <StarOff className="h-4 w-4 mr-2" />
              {t('admin.removeFromFeatured')}
            </DropdownMenuItem>
            {onExport && (
              <DropdownMenuItem onClick={() => onExport(selectedItems)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={() => onArchive(selectedItems)}>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(selectedItems)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('admin.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {onChangeCategory && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <FolderOpen className="h-4 w-4 mr-1" />
                Categoria
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onChangeCategory(selectedItems, 'tecnologia')}>
                Tecnologia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeCategory(selectedItems, 'design')}>
                Design
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeCategory(selectedItems, 'negócios')}>
                Negócios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeCategory(selectedItems, 'marketing')}>
                Marketing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};