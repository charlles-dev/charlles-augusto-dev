import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Folder, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  file_type: string;
  file_size: number;
  folder: string;
  alt_text: string | null;
  created_at: string;
}

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (url: string) => void;
}

export function MediaLibrary({ open, onOpenChange, onSelect }: MediaLibraryProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ['media-library', selectedFolder],
    queryFn: async () => {
      let query = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedFolder !== 'all') {
        query = query.eq('folder', selectedFolder);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaItem[];
    },
    enabled: open,
  });

  const { data: folders } = useQuery({
    queryKey: ['media-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_library')
        .select('folder')
        .not('folder', 'is', null);

      if (error) throw error;
      const uniqueFolders = [...new Set(data.map(item => item.folder))];
      return uniqueFolders as string[];
    },
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      // Validate folder selection
      const targetFolder = selectedFolder === 'all' ? 'uncategorized' : selectedFolder;
      
      const uploadPromises = files.map(async (file) => {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Arquivo ${file.name} excede o tamanho máximo de 10MB`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${targetFolder}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        await supabase.from('media_library').insert({
          filename: file.name,
          url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          folder: targetFolder,
        });

        return publicUrl;
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast({ title: "Upload concluído", description: "Arquivos enviados com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro no upload", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast({ title: "Arquivo deletado" });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const filteredMedia = media?.filter(item => 
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (url: string) => {
    if (onSelect) {
      onSelect(url);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Biblioteca de Mídia</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as pastas</SelectItem>
                {folders?.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragging
                ? "Solte os arquivos aqui..."
                : "Arraste imagens aqui ou clique para selecionar"}
            </p>
          </div>

          <ScrollArea className="h-96">
            {isLoading && <p className="text-center text-muted-foreground">Carregando...</p>}
            
            <div className="grid grid-cols-4 gap-4">
              {filteredMedia?.map((item) => (
                <Card 
                  key={item.id} 
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelect(item.url)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square relative rounded overflow-hidden mb-2 bg-muted">
                      <img
                        src={item.url}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(item.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs truncate">{item.filename}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Folder className="w-3 h-3" />
                      {item.folder}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}