'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, MoreHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post, likesAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.hasUserLikedPost);
  const [likesCount, setLikesCount] = useState(post.numberOfLikes);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await likesAPI.togglePostLike(post._id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      onLike?.(post._id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = () => {
    onComment?.(post._id);
  };

  const handleHashtagClick = (hashtag: string) => {
    const searchQuery = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    const params = new URLSearchParams({
      q: searchQuery,
      type: 'posts'
    });
    router.push(`/search?${params.toString()}`);
  };

  const renderCaptionWithHashtags = (caption: string) => {
    const parts = caption.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.match(/^#\w+$/)) {
        return (
          <button
            key={index}
            onClick={() => handleHashtagClick(part)}
            className="text-blue-500 hover:text-blue-600 hover:underline font-medium"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-muted))' }}>
            {post.postedBy.profilepic ? (
              <img 
                src={post.postedBy.profilepic} 
                alt={post.postedBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'hsl(var(--color-foreground))' }}>
              {post.postedBy.name}
            </h3>
            <p className="text-xs" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              @{post.postedBy.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}      <div className="mb-3">
        <div className="text-sm leading-relaxed" style={{ color: 'hsl(var(--color-foreground))' }}>
          {renderCaptionWithHashtags(post.caption)}
        </div>
        
        {/* Media Files */}
        {post.mediaFile && post.mediaFile.length > 0 && (
          <div className="mt-3 grid gap-2">
            {post.mediaFile.map((media, index) => (
              <img
                key={index}
                src={media}
                alt={`Post media ${index + 1}`}
                className="rounded-lg max-w-full h-auto"
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'hsl(var(--color-border))' }}>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className="flex items-center space-x-2 hover:bg-red-50"
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
            <span className="text-sm">{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="flex items-center space-x-2 hover:bg-blue-50"
          >
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{post.numberOfComments}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 hover:bg-green-50"
          >
            <Share className="w-4 h-4 text-green-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
