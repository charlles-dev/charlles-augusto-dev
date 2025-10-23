import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escreva seu conteúdo em Markdown...',
  className
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading1, action: () => insertMarkdown('# ', ''), label: 'Título 1' },
    { icon: Heading2, action: () => insertMarkdown('## ', ''), label: 'Título 2' },
    { icon: Heading3, action: () => insertMarkdown('### ', ''), label: 'Título 3' },
    { icon: Bold, action: () => insertMarkdown('**', '**'), label: 'Negrito' },
    { icon: Italic, action: () => insertMarkdown('_', '_'), label: 'Itálico' },
    { icon: Quote, action: () => insertMarkdown('> ', ''), label: 'Citação' },
    { icon: Code, action: () => insertMarkdown('`', '`'), label: 'Código inline' },
    { icon: LinkIcon, action: () => insertMarkdown('[', '](url)'), label: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), label: 'Imagem' },
    { icon: List, action: () => insertMarkdown('- ', ''), label: 'Lista' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', ''), label: 'Lista numerada' },
  ];

  // Simple markdown preview renderer
  const renderPreview = (markdown: string) => {
    return markdown
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-5 mb-3">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>;
        
        // Quote
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary pl-4 italic my-4">{line.slice(2)}</blockquote>;
        
        // Lists
        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
        if (/^\d+\. /.test(line)) return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
        
        // Bold and italic
        let processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/_(.*?)_/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded">$1</code>');
        
        return <p key={i} className="my-2" dangerouslySetInnerHTML={{ __html: processed }} />;
      });
  };

  return (
    <div className={cn("border rounded-lg", className)}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
        <div className="border-b bg-muted/50">
          <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0">
            <TabsTrigger value="edit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Visualizar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="mt-0">
          <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.label}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[400px] p-6 prose prose-slate dark:prose-invert max-w-none">
            {value ? renderPreview(value) : (
              <p className="text-muted-foreground italic">Nada para visualizar ainda...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
