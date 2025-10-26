import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";

interface ArticlePreviewProps {
  article: {
    title: string;
    content: string;
    excerpt: string;
    featured_image?: string | null;
    category: string;
    tags?: string[];
    seo_title?: string | null;
    seo_description?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticlePreview({ article, open, onOpenChange }: ArticlePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview do Artigo</DialogTitle>
        </DialogHeader>
        
        <article className="space-y-6">
          {article.featured_image && (
            <img 
              src={article.featured_image} 
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min de leitura</span>
              </div>
              <Badge variant="secondary">{article.category}</Badge>
            </div>
            
            <h1 className="text-4xl font-bold">{article.title}</h1>
            
            <p className="text-xl text-muted-foreground">{article.excerpt}</p>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4" />
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          
          {(article.seo_title || article.seo_description) && (
            <div className="border-t pt-6 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">SEO Preview</h3>
              <div className="space-y-1">
                <p className="text-lg text-blue-600 dark:text-blue-400">
                  {article.seo_title || article.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {article.seo_description || article.excerpt}
                </p>
              </div>
            </div>
          )}
        </article>
      </DialogContent>
    </Dialog>
  );
}