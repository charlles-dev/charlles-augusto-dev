import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Version {
  id: string;
  version_number: number;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  created_by: string | null;
  change_summary: string | null;
}

interface ArticleVersionHistoryProps {
  articleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (version: Version) => void;
}

export function ArticleVersionHistory({ 
  articleId, 
  open, 
  onOpenChange, 
  onRestore 
}: ArticleVersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  const { data: versions, isLoading } = useQuery({
    queryKey: ['article-versions', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_versions')
        .select('*')
        .eq('article_id', articleId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as Version[];
    },
    enabled: open && !!articleId,
  });

  const handleRestore = (version: Version) => {
    onRestore(version);
    onOpenChange(false);
    toast({
      title: "Versão restaurada",
      description: `Versão ${version.version_number} foi restaurada com sucesso.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Histórico de Versões</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 h-[600px]">
          <ScrollArea className="border rounded-lg p-4">
            {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
            
            {versions && versions.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma versão anterior</p>
            )}
            
            {versions?.map((version) => (
              <div
                key={version.id}
                className={`p-3 mb-2 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                  selectedVersion?.id === version.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedVersion(version)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge>Versão {version.version_number}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(version.created_at), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </div>
                </div>
                
                <p className="font-medium text-sm mb-1">{version.title}</p>
                
                {version.change_summary && (
                  <p className="text-xs text-muted-foreground">{version.change_summary}</p>
                )}
                
                {version.created_by && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: {version.created_by}
                  </p>
                )}
              </div>
            ))}
          </ScrollArea>

          <div className="border rounded-lg p-4">
            {selectedVersion ? (
              <div className="space-y-4 h-full flex flex-col">
                <div>
                  <h3 className="font-semibold mb-2">{selectedVersion.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedVersion.excerpt}
                  </p>
                </div>
                
                <ScrollArea className="flex-1">
                  <div 
                    className="prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
                  />
                </ScrollArea>

                <Button 
                  onClick={() => handleRestore(selectedVersion)}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurar esta versão
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione uma versão para visualizar
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}