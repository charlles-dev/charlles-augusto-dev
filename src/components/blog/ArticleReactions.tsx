import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ArticleReactionsProps {
  articleId: string;
  initialLikes?: number;
  className?: string;
}

export const ArticleReactions: React.FC<ArticleReactionsProps> = ({
  articleId,
  initialLikes = 0,
  className
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get user IP (simplified - in production use a proper IP detection service)
  const getUserIp = () => {
    return localStorage.getItem('user_session') || `session_${Date.now()}`;
  };

  useEffect(() => {
    checkIfUserLiked();
  }, [articleId]);

  const checkIfUserLiked = async () => {
    try {
      const userIp = getUserIp();
      const { data } = await supabase
        .from('article_reactions')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_ip', userIp)
        .maybeSingle();

      setHasLiked(!!data);
    } catch (error) {
      console.error('Error checking reaction:', error);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const userIp = getUserIp();

    try {
      if (hasLiked) {
        // Unlike
        const { error } = await supabase
          .from('article_reactions')
          .delete()
          .eq('article_id', articleId)
          .eq('user_ip', userIp);

        if (error) throw error;

        setLikes(prev => Math.max(0, prev - 1));
        setHasLiked(false);
        toast.success('Reação removida');
      } else {
        // Like
        const { error } = await supabase
          .from('article_reactions')
          .insert({
            article_id: articleId,
            user_ip: userIp,
            reaction_type: 'like'
          });

        if (error) throw error;

        setLikes(prev => prev + 1);
        setHasLiked(true);
        toast.success('Obrigado pela reação! ❤️');
      }
    } catch (error: any) {
      console.error('Error toggling reaction:', error);
      toast.error('Erro ao processar reação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant={hasLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "gap-2 transition-all",
          hasLiked && "bg-red-500 hover:bg-red-600 text-white"
        )}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-all",
            hasLiked && "fill-current"
          )} 
        />
        <span className="font-medium">{likes}</span>
      </Button>
    </div>
  );
};
