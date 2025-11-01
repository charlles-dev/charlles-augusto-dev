import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Eye, FileText, Heart, History, Image as ImageIcon, Calendar as CalendarIcon, Clock, Filter } from 'lucide-react';
import { MarkdownEditor } from './MarkdownEditor';
import { ArticlePreview } from './ArticlePreview';
import { ArticleVersionHistory } from './ArticleVersionHistory';
import { MediaLibrary } from './MediaLibrary';
import { BulkActionsBar } from './BulkActionsBar';
import { BlogStats } from './BlogStats';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAdminActions } from '@/hooks/useAdminActions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { estimateReadTime } from '@/utils/markdown';

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
  scheduled_at?: string;
  created_at: string;
}

export const BlogManager = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionArticleId, setVersionArticleId] = useState<string | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent');
  const queryClient = useQueryClient();
  const { duplicateItem, bulkUpdate, bulkDelete } = useAdminActions('articles');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles', filterStatus, sortBy],
    queryFn: async () => {
      let query = supabase.from('articles').select('*');
      
      if (filterStatus === 'published') {
        query = query.eq('is_published', true);
      } else if (filterStatus === 'draft') {
        query = query.eq('is_published', false);
      }
      
      if (sortBy === 'popular') {
        query = query.order('likes_count', { ascending: false });
      } else if (sortBy === 'views') {
        query = query.order('views_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted successfully');
    },
    onError: () => toast.error('Failed to delete article'),
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('articles').update({ 
        is_published,
        published_at: is_published ? new Date().toISOString() : null
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article status updated');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from('articles').update({ is_featured }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Featured status updated');
    },
  });

  const handleBulkAction = async (action: (ids: string[]) => Promise<void>) => {
    try {
      await action(selectedArticles);
      setSelectedArticles([]);
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === articles?.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles?.map(a => a.id) || []);
    }
  };

  return (
    <div className="space-y-6">
      <BlogStats />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Blog Articles</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Articles</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedArticle(null)}>
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedArticle ? 'Edit Article' : 'Create Article'}</DialogTitle>
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
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {articles && articles.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={selectedArticles.length === articles.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select All ({selectedArticles.length} selected)
              </span>
            </div>
          )}
          
          <div className="space-y-4">
            {articles?.map((article) => (
              <Card key={article.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedArticles([...selectedArticles, article.id]);
                          } else {
                            setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                          }
                        }}
                        className="mt-1"
                      />
                      
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
                          onClick={() => setPreviewArticle(article)}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVersionArticleId(article.id);
                            setShowVersionHistory(true);
                          }}
                          title="Version History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
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
        </>
      )}
      
      <BulkActionsBar
        selectedItems={selectedArticles}
        onDuplicate={(ids) => handleBulkAction(() => duplicateItem(ids[0]))}
        onPublish={(ids) => handleBulkAction(() => bulkUpdate(ids, { is_published: true }))}
        onUnpublish={(ids) => handleBulkAction(() => bulkUpdate(ids, { is_published: false }))}
        onMarkFeatured={(ids) => handleBulkAction(() => bulkUpdate(ids, { is_featured: true }))}
        onRemoveFeatured={(ids) => handleBulkAction(() => bulkUpdate(ids, { is_featured: false }))}
        onDelete={(ids) => handleBulkAction(() => bulkDelete(ids))}
      />
      
      {previewArticle && (
        <ArticlePreview
          article={previewArticle}
          open={!!previewArticle}
          onOpenChange={(open) => !open && setPreviewArticle(null)}
        />
      )}
      
      {versionArticleId && (
        <ArticleVersionHistory
          articleId={versionArticleId}
          open={showVersionHistory}
          onOpenChange={setShowVersionHistory}
          onRestore={(version) => {
            setSelectedArticle({
              id: versionArticleId,
              title: version.title,
              content: version.content,
              excerpt: version.excerpt,
              slug: '',
              category: '',
              tags: [],
              is_published: false,
              is_featured: false,
              views_count: 0,
              likes_count: 0,
              created_at: new Date().toISOString(),
            } as Article);
            setIsDialogOpen(true);
          }}
        />
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
    scheduled_at: article?.scheduled_at ? new Date(article.scheduled_at) : undefined,
  });
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const queryClient = useQueryClient();
  
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      read_time: estimateReadTime(content).toString()
    }));
    autoSave.markDirty();
  };
  
  const autoSave = useAutoSave({
    onSave: async () => {
      if (article?.id && formData.title && formData.content) {
        await saveMutation.mutateAsync(formData);
      }
    },
    delay: 5000
  });

  const saveVersionMutation = useMutation({
    mutationFn: async (articleData: any) => {
      if (!article?.id) return;
      
      const { data: existingVersions } = await supabase
        .from('article_versions')
        .select('version_number')
        .eq('article_id', article.id)
        .order('version_number', { ascending: false })
        .limit(1);
      
      const nextVersion = existingVersions && existingVersions.length > 0 
        ? existingVersions[0].version_number + 1 
        : 1;
      
      const { error } = await supabase.from('article_versions').insert({
        article_id: article.id,
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        featured_image: articleData.featured_image,
        category: articleData.category,
        tags: articleData.tags,
        seo_title: articleData.seo_title,
        seo_description: articleData.seo_description,
        version_number: nextVersion,
        change_summary: 'Atualização manual',
      });
      
      if (error) throw error;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (data.slug) {
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', data.slug)
          .neq('id', article?.id || '')
          .maybeSingle();
        
        if (existing) {
          throw new Error('Slug already exists. Please choose a different one.');
        }
      }
      
      const payload = {
        ...data,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        read_time: data.read_time ? parseInt(data.read_time) : null,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        scheduled_at: data.scheduled_at ? data.scheduled_at.toISOString() : null,
      };

      if (article) {
        await saveVersionMutation.mutateAsync(payload);
        const { error } = await supabase.from('articles').update(payload).eq('id', article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('articles').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success(article ? 'Article updated successfully' : 'Article created successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save article');
    },
  });

  return (
    <Tabs defaultValue="content" className="space-y-4">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="seo">SEO & Schedule</TabsTrigger>
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
            onChange={handleContentChange}
            placeholder="Escreva o conteúdo do artigo em Markdown..."
          />
          {autoSave.isSaving && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3 animate-spin" />
              Auto-saving...
            </p>
          )}
          {autoSave.lastSaved && (
            <p className="text-xs text-muted-foreground mt-1">
              Last saved: {format(autoSave.lastSaved, 'HH:mm:ss')}
            </p>
          )}
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
              placeholder="Auto-calculated"
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">
              Automatically calculated from content length
            </p>
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
          <div className="flex gap-2">
            <Input
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMediaLibrary(true)}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
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
        <div>
          <Label>Schedule Publication</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.scheduled_at && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.scheduled_at ? format(formData.scheduled_at, 'PPP HH:mm') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.scheduled_at}
                onSelect={(date) => setFormData({ ...formData, scheduled_at: date })}
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to publish immediately
          </p>
        </div>
      </TabsContent>

      <div className="flex justify-between gap-2">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => setShowPreview(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={() => saveMutation.mutate(formData)}
            disabled={!formData.title || !formData.excerpt || !formData.content || !formData.category}
          >
            {article ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
      
      <MediaLibrary
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelect={(url) => setFormData({ ...formData, featured_image: url })}
      />
      
      {showPreview && (
        <ArticlePreview
          article={{
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          }}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      )}
    </Tabs>
  );
};
