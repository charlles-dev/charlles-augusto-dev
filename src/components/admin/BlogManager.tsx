import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Eye, FileText, Heart } from 'lucide-react';
import { MarkdownEditor } from './MarkdownEditor';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image?: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  read_time?: number;
  seo_title?: string;
  seo_description?: string;
  published_at?: string;
  created_at: string;
}

export const BlogManager = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete article');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('articles')
        .update({ 
          is_published,
          published_at: is_published ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article status updated');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from('articles')
        .update({ is_featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Featured status updated');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Articles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedArticle(null)}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedArticle ? 'Edit Article' : 'Create Article'}
              </DialogTitle>
            </DialogHeader>
            <ArticleForm 
              article={selectedArticle} 
              onClose={() => {
                setIsDialogOpen(false);
                setSelectedArticle(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {articles?.map((article) => (
            <Card key={article.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{article.title}</h3>
                      {article.is_published && <Badge>Published</Badge>}
                      {article.is_featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {article.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {article.category}
                      </span>
                      {article.read_time && <span>{article.read_time} min</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`publish-${article.id}`}>Publish</Label>
                      <Switch
                        id={`publish-${article.id}`}
                        checked={article.is_published}
                        onCheckedChange={(checked) => 
                          togglePublishMutation.mutate({ id: article.id, is_published: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`featured-${article.id}`}>Featured</Label>
                      <Switch
                        id={`featured-${article.id}`}
                        checked={article.is_featured}
                        onCheckedChange={(checked) => 
                          toggleFeaturedMutation.mutate({ id: article.id, is_featured: checked })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedArticle(article);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this article?')) {
                            deleteMutation.mutate(article.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ArticleForm = ({ article, onClose }: { article: Article | null; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || '',
    tags: article?.tags?.join(', ') || '',
    featured_image: article?.featured_image || '',
    read_time: article?.read_time?.toString() || '',
    seo_title: article?.seo_title || '',
    seo_description: article?.seo_description || '',
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        read_time: data.read_time ? parseInt(data.read_time) : null,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      if (article) {
        const { error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', article.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([payload]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success(article ? 'Article updated' : 'Article created');
      onClose();
    },
    onError: () => {
      toast.error('Failed to save article');
    },
  });

  return (
    <Tabs defaultValue="content" className="space-y-4">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div>
          <Label>Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Article title"
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="article-slug (auto-generated if empty)"
          />
        </div>
        <div>
          <Label>Excerpt *</Label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Short description"
            rows={2}
          />
        </div>
        <div>
          <Label>Content *</Label>
          <MarkdownEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Escreva o conteúdo do artigo em Markdown..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category *</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Technology, Design, etc."
            />
          </div>
          <div>
            <Label>Read Time (minutes)</Label>
            <Input
              type="number"
              value={formData.read_time}
              onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
              placeholder="5"
            />
          </div>
        </div>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="react, typescript, web development"
          />
        </div>
        <div>
          <Label>Featured Image URL</Label>
          <Input
            value={formData.featured_image}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </TabsContent>

      <TabsContent value="seo" className="space-y-4">
        <div>
          <Label>SEO Title</Label>
          <Input
            value={formData.seo_title}
            onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
            placeholder="Leave empty to use article title"
          />
        </div>
        <div>
          <Label>SEO Description</Label>
          <Textarea
            value={formData.seo_description}
            onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
            placeholder="Leave empty to use excerpt"
            rows={3}
          />
        </div>
      </TabsContent>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => saveMutation.mutate(formData)}
          disabled={!formData.title || !formData.excerpt || !formData.content || !formData.category}
        >
          {article ? 'Update' : 'Create'}
        </Button>
      </div>
    </Tabs>
  );
};
