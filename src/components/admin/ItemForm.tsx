import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project, Education, Experience } from '@/types/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import ImageUpload from './ImageUpload';

const baseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  image_url: z.string().url().optional().or(z.literal('')),
  display_order: z.number().min(0),
});

const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  technologies: z.array(z.string()),
  github: z.string().url('URL inválida').nullable().or(z.literal('')),
  demo: z.string().url('URL inválida').nullable().or(z.literal('')),
  image: z.string().nullable().or(z.literal('')),
  display_order: z.number().min(0),
});

const educationSchema = baseSchema.extend({
  institution: z.string().min(1, 'Instituição é obrigatória'),
  degree: z.string().min(1, 'Grau é obrigatório'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
});

const experienceSchema = baseSchema.extend({
  company: z.string().min(1, 'Empresa é obrigatória'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
});

type ItemType = 'projects' | 'education' | 'experiences';

type ProjectFormData = z.infer<typeof projectSchema>;
type EducationFormData = z.infer<typeof educationSchema>;
type ExperienceFormData = z.infer<typeof experienceSchema>;

type FormDataMap = {
  projects: ProjectFormData;
  education: EducationFormData;
  experiences: ExperienceFormData;
};

type FormData = FormDataMap[ItemType];

interface ItemFormProps {
  type: ItemType;
  item?: Project | Education | Experience;
  onSuccess?: () => void;
}

const getSchema = (type: ItemType) => {
  switch (type) {
    case 'projects':
      return projectSchema;
    case 'education':
      return educationSchema;
    case 'experiences':
      return experienceSchema;
    default:
      return baseSchema;
  }
};

const getDefaultValues = (type: ItemType, item?: Project | Education | Experience): FormData => {
  switch (type) {
    case 'projects':
      return {
        name: (item as Project)?.name || '',
        description: (item as Project)?.description || '',
        technologies: (item as Project)?.technologies || [],
        github: (item as Project)?.github || '',
        demo: (item as Project)?.demo || '',
        image: (item as Project)?.image || '',
        display_order: (item as Project)?.display_order || 0,
      };
    case 'education':
      return {
        title: (item as Education)?.title || '',
        description: item?.description || '',
        institution: (item as Education)?.institution || '',
        degree: (item as Education)?.degree || '',
        start_date: (item as Education)?.start_date || '',
        end_date: (item as Education)?.end_date || '',
        is_current: (item as Education)?.is_current || false,
        image_url: (item as Education)?.image_url || '',
        display_order: item?.display_order || 0,
      };
    case 'experiences':
      return {
        title: (item as Experience)?.title || '',
        description: item?.description || '',
        company: (item as Experience)?.company || '',
        position: (item as Experience)?.position || '',
        start_date: (item as Experience)?.start_date || '',
        end_date: (item as Experience)?.end_date || '',
        is_current: (item as Experience)?.is_current || false,
        image_url: (item as Experience)?.image_url || '',
        display_order: item?.display_order || 0,
      };
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};

export const ItemForm: React.FC<ItemFormProps> = ({ type, item, onSuccess }) => {
  const queryClient = useQueryClient();
  const schema = getSchema(type);
  const isEdit = !!item;

  const form = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: getDefaultValues(type, item) as any,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const updated_at = new Date().toISOString();
      
      const tableData = { ...data, updated_at };

      if (isEdit) {
        const { error } = await supabase
          .from(type)
          .update(tableData)
          .eq('id', item!.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(type)
          .insert([tableData] as any);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      toast.success(isEdit ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!');
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar item');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleImageUploaded = (url: string) => {
    const imageField = type === 'projects' ? 'image' : 'image_url';
    form.setValue(imageField as any, url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {type === 'projects' && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Projeto</FormLabel>
                        <FormControl>
                          <Input placeholder="Meu Projeto Incrível" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {type === 'education' && (
                  <>
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instituição</FormLabel>
                          <FormControl>
                            <Input placeholder="Universidade X" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grau</FormLabel>
                          <FormControl>
                            <Input placeholder="Bacharelado em Ciência da Computação" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {type === 'experiences' && (
                  <>
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Tech Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input placeholder="Desenvolvedor Full Stack" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}



                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o item..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagem</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  currentImage={form.watch(type === 'projects' ? 'image' : 'image_url')}
                  bucket={type === 'projects' ? 'project-images' : 'avatars'}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem de Exibição</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {(type === 'education' || type === 'experiences') && (
              <Card>
                <CardHeader>
                  <CardTitle>Datas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Término</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_current"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Atual</FormLabel>
                          <FormDescription>
                            Ainda está em andamento
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {type === 'projects' && (
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/usuario/projeto" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="demo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo</FormLabel>
                        <FormControl>
                          <Input placeholder="https://meuprojeto.com" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};