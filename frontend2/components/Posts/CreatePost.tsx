'use client';

import { useState, useRef } from 'react';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Image, X, Loader2, Hash, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePostProps {
  onPostCreated?: () => void;
  className?: string;
}

export function CreatePost({ onPostCreated, className }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Extract hashtags automatically
    const extractedHashtags = extractHashtags(newContent);
    setHashtags(extractedHashtags);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Create FormData for the API
      const formData = new FormData();
      formData.append('caption', content.trim());
      formData.append('isPublic', isPublic.toString());
      
      // Add hashtags if any
      if (hashtags.length > 0) {
        formData.append('hashtags', JSON.stringify(hashtags));
      }

      await postsAPI.createPost(formData);

      // Reset form
      setContent('');
      setHashtags([]);
      setIsPublic(true);
      
      // Notify parent component
      onPostCreated?.();
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(prev => prev.filter(tag => tag !== tagToRemove));
    // Also remove from content
    setContent(prev => prev.replace(new RegExp(`#${tagToRemove}\\b`, 'g'), '').trim());
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create Post</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPublic(!isPublic)}
            className="flex items-center space-x-2"
          >
            {isPublic ? (
              <>
                <Globe className="w-4 h-4" />
                <span className="text-sm">Public</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-sm">Private</span>
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Avatar and Input */}
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="What's happening?"
                className="min-h-[100px] resize-none border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground"
                maxLength={characterLimit}
              />
            </div>
          </div>

          {/* Hashtags Display */}
          <AnimatePresence>
            {hashtags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {hashtags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4 h-4 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeHashtag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              {/* Image Upload Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <Image className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  // Handle image upload logic here
                  console.log('File selected:', e.target.files?.[0]);
                }}
              />

              {/* Character Count */}
              <div className="flex items-center space-x-2">
                <div 
                  className={`text-sm ${
                    remainingChars < 20 
                      ? 'text-destructive' 
                      : remainingChars < 50 
                      ? 'text-warning' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {remainingChars}
                </div>
                <div className="w-8 h-8 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-current text-muted-foreground/20"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`stroke-current ${
                        remainingChars < 20 
                          ? 'text-destructive' 
                          : remainingChars < 50 
                          ? 'text-warning' 
                          : 'text-primary'
                      }`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${((characterLimit - remainingChars) / characterLimit) * 100}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting || remainingChars < 0}
              className="min-w-[80px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
