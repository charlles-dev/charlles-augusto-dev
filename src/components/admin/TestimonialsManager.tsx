import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableList } from '@/components/admin/SortableList';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Testimonial {
  id: string;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_image: string | null;
  content: string;
  rating: number;
  project_reference: string | null;
  is_featured: boolean;
  is_approved: boolean;
  display_order: number;
  status: string;
  created_at: string;
}

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Erro ao carregar testimonials',
        description: 'Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ));

      toast({
        title: 'Testimonial atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: 'Erro ao atualizar testimonial',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== id));
      
      toast({
        title: 'Testimonial excluído',
        description: 'O testimonial foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Erro ao excluir testimonial',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleReorder = async (newItems: Testimonial[]) => {
    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from('testimonials')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setTestimonials(newItems.map((item, index) => ({
        ...item,
        display_order: index + 1,
      })));

      toast({
        title: 'Ordem atualizada',
        description: 'A ordem dos testimonials foi atualizada.',
      });
    } catch (error) {
      console.error('Error reordering testimonials:', error);
      toast({
        title: 'Erro ao reordenar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getStatusBadge = (testimonial: Testimonial) => {
    if (!testimonial.is_approved) {
      return <Badge variant="destructive">Pendente</Badge>;
    }
    if (testimonial.status !== 'published') {
      return <Badge variant="secondary">Rascunho</Badge>;
    }
    if (testimonial.is_featured) {
      return <Badge variant="default" className="bg-primary">Destaque</Badge>;
    }
    return <Badge variant="outline">Publicado</Badge>;
  };

  const renderTestimonialItem = (testimonial: Testimonial) => (
    <Card key={testimonial.id} className="border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={testimonial.client_image || ''} 
                alt={testimonial.client_name}
              />
              <AvatarFallback>
                {testimonial.client_name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{testimonial.client_name}</h3>
              <p className="text-sm text-muted-foreground">
                {testimonial.client_position}
                {testimonial.client_company && ` • ${testimonial.client_company}`}
              </p>
              <div className="flex items-center mt-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(testimonial)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!testimonial.is_approved && (
                  <DropdownMenuItem
                    onClick={() => updateTestimonial(testimonial.id, { 
                      is_approved: true, 
                      status: 'published' 
                    })}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Aprovar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => updateTestimonial(testimonial.id, { 
                    is_featured: !testimonial.is_featured 
                  })}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {testimonial.is_featured ? 'Remover destaque' : 'Destacar'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateTestimonial(testimonial.id, { 
                    status: testimonial.status === 'published' ? 'draft' : 'published' 
                  })}
                >
                  {testimonial.status === 'published' ? 'Despublicar' : 'Publicar'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <blockquote className="text-sm italic mb-2">
          "{testimonial.content}"
        </blockquote>

        {testimonial.project_reference && (
          <p className="text-xs text-primary/70 mb-2">
            Projeto: {testimonial.project_reference}
          </p>
        )}

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            Criado {formatDistanceToNow(new Date(testimonial.created_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
          <span>Ordem: {testimonial.display_order}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5" />
          Testimonials ({testimonials.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Gerencie feedbacks e avaliações de clientes
        </p>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum testimonial encontrado.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Arraste para reordenar os testimonials
              </p>
            </div>
            
            <SortableList
              items={testimonials}
              onReorder={handleReorder}
              renderItem={renderTestimonialItem}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialsManager;