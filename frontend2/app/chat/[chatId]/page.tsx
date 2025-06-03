'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { chatAPI, messagesAPI, Chat, Message } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  MoreVertical, 
  UserPlus, 
  UserMinus, 
  LogOut, 
  Trash2,
  Phone,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddParticipantModal } from '@/components/Chat/AddParticipantModal';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const chatId = params.chatId as string;
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat details and messages
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setIsLoading(true);
        const [chatResponse, messagesResponse] = await Promise.all([
          chatAPI.getChatById(chatId),
          messagesAPI.getChatMessages(chatId)
        ]);
          setChat(chatResponse);
        setMessages(messagesResponse.messages);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        router.push('/home');
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      fetchChatData();
    }
  }, [chatId, router]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat || isSending) return;

    try {
      setIsSending(true);
      const message = await messagesAPI.sendMessage(chat._id, newMessage.trim());
      setMessages(prev => [...prev, message]);      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  const handleLeaveChat = async () => {
    if (!chat) return;
    
    try {
      await chatAPI.leaveChat(chat._id);
      router.push('/home');
    } catch (error) {
      console.error('Error leaving chat:', error);
    }
  };

  const handleDeleteChat = async () => {
    if (!chat) return;
    
    try {
      await chatAPI.deleteChat(chat._id);
      router.push('/home');
    } catch (error) {
      console.error('Error deleting chat:', error);    }
  };

  const handleParticipantAdded = async () => {
    // Refresh chat data after adding participant
    try {
      const chatResponse = await chatAPI.getChatById(chatId);
      setChat(chatResponse);
    } catch (error) {
      console.error('Error refreshing chat:', error);
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.isGroupChat) {
      return chat.chatName || 'Group Chat';
    }
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="w-8 h-8" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className="h-12 w-48 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Chat not found</h2>
          <p className="text-muted-foreground mb-4">This chat may have been deleted or you don't have access to it.</p>
          <Button onClick={() => router.push('/home')}>
            Go back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/home')}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getChatAvatar(chat)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">{getChatName(chat)}</h1>
            <p className="text-sm text-muted-foreground">
              {chat.isGroupChat 
                ? `${chat.participants.length} members`
                : 'Direct message'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!chat.isGroupChat && (
            <>
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chat Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
                {chat.isGroupChat && (
                <>
                  <DropdownMenuItem onClick={() => setShowAddParticipant(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Participant
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="w-4 h-4 mr-2" />
                    View Members
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={handleLeaveChat} className="text-orange-600">
                <LogOut className="w-4 h-4 mr-2" />
                Leave Chat
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender._id === user?._id
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  }`}
                >
                  {chat.isGroupChat && message.sender._id !== user?._id && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {message.sender.name}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender._id === user?._id
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}>
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newMessage.trim() || isSending}
            className="px-4"
          >
            <Send className="w-4 h-4" />          </Button>
        </form>
      </div>

      {/* Add Participant Modal */}
      {showAddParticipant && (
        <AddParticipantModal
          chatId={chatId}
          onClose={() => setShowAddParticipant(false)}
          onParticipantAdded={handleParticipantAdded}
        />
      )}
    </div>
  );
}
