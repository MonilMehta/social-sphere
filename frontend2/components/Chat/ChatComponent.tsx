'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chatAPI, Chat } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Users, MoreVertical, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ChatComponentProps {
  className?: string;
}

export function ChatComponent({ className }: ChatComponentProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const response = await chatAPI.getAllChats();
        setChats(response.chats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const getChatName = (chat: Chat) => {
    if (chat.isGroupChat) {
      return chat.chatName || 'Group Chat';
    }
    // For direct messages, show the other participant's name
    const otherParticipant = chat.participants.find(p => p._id !== user?._id);
    return otherParticipant?.name || otherParticipant?.username || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.isGroupChat) {
      return chat.chatName?.[0]?.toUpperCase() || 'G';
    }
    const otherParticipant = chat.participants.find(p => p._id !== user?._id);
    return otherParticipant?.name?.[0]?.toUpperCase() || 'U';
  };
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-primary" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="p-3 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No chats yet. Start a conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {chats.map((chat) => (
                  <motion.div
                    key={chat._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChatClick(chat._id)}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent hover:border-primary/20"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getChatAvatar(chat)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {getChatName(chat)}
                        </p>
                        {chat.isGroupChat && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            <Users className="w-3 h-3 mr-1" />
                            {chat.participants.length}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate flex-1">
                          {typeof chat.lastMessage === 'object' && chat.lastMessage?.content 
                            ? chat.lastMessage.content 
                            : typeof chat.lastMessage === 'string' 
                              ? chat.lastMessage 
                              : 'Start a conversation'}
                        </p>
                        {chat.lastMessage && (
                          <p className="text-xs text-muted-foreground ml-2">
                            {formatDistanceToNow(
                              new Date(
                                typeof chat.lastMessage === 'object' 
                                  ? chat.lastMessage.createdAt 
                                  : chat.updatedAt
                              ), 
                              { addSuffix: true }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
