import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Check, X, Trash2, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  articles?: {
    title: string;
    slug: string;
  };
}

export const CommentsManager = () => {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_comments')
        .select(`
          *,
          articles (
            title,
            slug
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Comment[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase
        .from('article_comments')
        .update({ is_approved })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Comment status updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('article_comments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Comment deleted');
    },
  });

  const pendingComments = comments?.filter(c => !c.is_approved) || [];
  const approvedComments = comments?.filter(c => c.is_approved) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Comments Management</h2>
        {pendingComments.length > 0 && (
          <Badge variant="destructive">{pendingComments.length} pending</Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingComments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pending Approval</h3>
              {pendingComments.map((comment) => (
                <CommentCard 
                  key={comment.id} 
                  comment={comment}
                  onApprove={() => approveMutation.mutate({ id: comment.id, is_approved: true })}
                  onReject={() => approveMutation.mutate({ id: comment.id, is_approved: false })}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this comment?')) {
                      deleteMutation.mutate(comment.id);
                    }
                  }}
                />
              ))}
            </div>
          )}

          {approvedComments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Approved Comments</h3>
              {approvedComments.map((comment) => (
                <CommentCard 
                  key={comment.id} 
                  comment={comment}
                  onReject={() => approveMutation.mutate({ id: comment.id, is_approved: false })}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this comment?')) {
                      deleteMutation.mutate(comment.id);
                    }
                  }}
                />
              ))}
            </div>
          )}

          {comments?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No comments yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommentCard = ({ 
  comment, 
  onApprove, 
  onReject, 
  onDelete 
}: { 
  comment: Comment; 
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex gap-4">
        <Avatar>
          <AvatarFallback>
            {comment.author_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{comment.author_name}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {comment.author_email}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-muted-foreground">{comment.content}</p>
          {comment.articles && (
            <div className="text-sm text-muted-foreground">
              Article: <span className="font-medium">{comment.articles.title}</span>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            {!comment.is_approved && onApprove && (
              <Button size="sm" variant="default" onClick={onApprove}>
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            )}
            {comment.is_approved && onReject && (
              <Button size="sm" variant="outline" onClick={onReject}>
                <X className="h-4 w-4 mr-1" />
                Unapprove
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
