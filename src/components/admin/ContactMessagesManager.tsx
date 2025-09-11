import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  Check, 
  Trash2, 
  Eye,
  MoreVertical,
  Reply
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: string;
  is_spam: boolean;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unread');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: 'Erro ao carregar mensagens',
        description: 'Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          replied_at: status === 'replied' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id 
          ? { ...msg, status, replied_at: status === 'replied' ? new Date().toISOString() : null }
          : msg
      ));

      toast({
        title: 'Status atualizado',
        description: `Mensagem marcada como ${status === 'read' ? 'lida' : 'respondida'}.`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const markAsSpam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_spam: true, status: 'spam' })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_spam: true, status: 'spam' } : msg
      ));

      toast({
        title: 'Marcado como spam',
        description: 'A mensagem foi marcada como spam.',
      });
    } catch (error) {
      console.error('Error marking as spam:', error);
      toast({
        title: 'Erro ao marcar como spam',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      
      toast({
        title: 'Mensagem excluída',
        description: 'A mensagem foi excluída com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Erro ao excluir mensagem',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive">Não Lida</Badge>;
      case 'read':
        return <Badge variant="secondary">Lida</Badge>;
      case 'replied':
        return <Badge variant="default" className="bg-primary">Respondida</Badge>;
      case 'spam':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Spam</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredMessages = messages.filter(msg => {
    switch (activeTab) {
      case 'unread':
        return msg.status === 'unread';
      case 'read':
        return msg.status === 'read';
      case 'replied':
        return msg.status === 'replied';
      case 'spam':
        return msg.is_spam;
      case 'all':
      default:
        return true;
    }
  });

  const getUnreadCount = () => messages.filter(msg => msg.status === 'unread').length;
  const getReadCount = () => messages.filter(msg => msg.status === 'read').length;
  const getRepliedCount = () => messages.filter(msg => msg.status === 'replied').length;
  const getSpamCount = () => messages.filter(msg => msg.is_spam).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mensagens de Contato</CardTitle>
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
          <Mail className="mr-2 h-5 w-5" />
          Mensagens de Contato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="unread" className="text-xs">
              Não Lidas {getUnreadCount() > 0 && `(${getUnreadCount()})`}
            </TabsTrigger>
            <TabsTrigger value="read" className="text-xs">
              Lidas {getReadCount() > 0 && `(${getReadCount()})`}
            </TabsTrigger>
            <TabsTrigger value="replied" className="text-xs">
              Respondidas {getRepliedCount() > 0 && `(${getRepliedCount()})`}
            </TabsTrigger>
            <TabsTrigger value="spam" className="text-xs">
              Spam {getSpamCount() > 0 && `(${getSpamCount()})`}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              Todas ({messages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma mensagem encontrada nesta categoria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <Card key={message.id} className="border-l-4 border-l-primary/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{message.name}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDistanceToNow(new Date(message.created_at), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {message.status === 'unread' && (
                                <DropdownMenuItem
                                  onClick={() => updateMessageStatus(message.id, 'read')}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Marcar como lida
                                </DropdownMenuItem>
                              )}
                              {message.status !== 'replied' && (
                                <DropdownMenuItem
                                  onClick={() => updateMessageStatus(message.id, 'replied')}
                                >
                                  <Reply className="mr-2 h-4 w-4" />
                                  Marcar como respondida
                                </DropdownMenuItem>
                              )}
                              {!message.is_spam && (
                                <DropdownMenuItem
                                  onClick={() => markAsSpam(message.id)}
                                >
                                  Marcar como spam
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteMessage(message.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          <a 
                            href={`mailto:${message.email}`}
                            className="hover:text-primary transition-colors"
                          >
                            {message.email}
                          </a>
                        </div>
                        {message.phone && (
                          <div className="flex items-center">
                            <Phone className="mr-1 h-3 w-3" />
                            <a 
                              href={`tel:${message.phone}`}
                              className="hover:text-primary transition-colors"
                            >
                              {message.phone}
                            </a>
                          </div>
                        )}
                        {message.company && (
                          <div className="flex items-center">
                            <Building2 className="mr-1 h-3 w-3" />
                            {message.company}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-primary mb-1">
                          {message.subject}
                        </h4>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      {message.replied_at && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Check className="mr-1 h-3 w-3 text-primary" />
                          Respondida em {formatDistanceToNow(new Date(message.replied_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContactMessagesManager;