import React, { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Upload, FileJson, FileText, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExportImportProps {
  table: string;
  title: string;
}

export const ExportImport: React.FC<ExportImportProps> = ({ table, title }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const queryClient = useQueryClient();

  const exportToJSON = async () => {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*');

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${table}-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Exportado com sucesso!',
        description: `${data.length} items exportados`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const exportToMarkdown = async () => {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*');

      if (error) throw error;

      let markdown = `# ${title}\n\n`;
      markdown += `Exportado em: ${new Date().toLocaleString()}\n\n`;
      markdown += `Total de items: ${data.length}\n\n---\n\n`;

      data.forEach((item: any, index: number) => {
        markdown += `## Item ${index + 1}\n\n`;
        Object.entries(item).forEach(([key, value]) => {
          markdown += `**${key}**: ${value}\n\n`;
        });
        markdown += '---\n\n';
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${table}-${new Date().toISOString()}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Exportado com sucesso!',
        description: `${data.length} items exportados em Markdown`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('Arquivo JSON deve conter um array');
      }

      // Remove id, created_at, updated_at para evitar conflitos
      const cleanedData = data.map(({ id, created_at, updated_at, ...rest }) => rest);

      const { error } = await supabase
        .from(table as any)
        .insert(cleanedData);

      if (error) throw error;

      toast({
        title: 'Importado com sucesso!',
        description: `${cleanedData.length} items importados`,
      });

      queryClient.invalidateQueries({ queryKey: [table] });
    } catch (error) {
      toast({
        title: 'Erro ao importar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar / Importar {title}</CardTitle>
        <CardDescription>
          Faça backup dos seus dados ou importe de outro sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            A importação irá adicionar novos items. Items existentes não serão substituídos.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToJSON} variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            Exportar JSON
          </Button>

          <Button onClick={exportToMarkdown} variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Exportar Markdown
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="gap-2"
            disabled={importing}
          >
            <Upload className="h-4 w-4" />
            {importing ? 'Importando...' : 'Importar JSON'}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};
