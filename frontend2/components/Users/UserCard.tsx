'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, UserPlus, UserCheck, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType, followAPI } from '@/lib/api';

interface UserCardProps {
  user: UserType;
  showFollowButton?: boolean;
  onFollow?: (userId: string) => void;
}

export default function UserCard({ user, showFollowButton = true, onFollow }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking follow button
    if (loading) return;
    
    setLoading(true);
    try {
      await followAPI.toggleFollow(user._id);
      setIsFollowing(!isFollowing);
      onFollow?.(user._id);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/profile/${user.username}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
      style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}
      onClick={handleCardClick}
    >      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Profile Picture */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2" 
                 style={{ backgroundColor: 'hsl(var(--color-muted))', borderColor: 'hsl(var(--color-border))' }}>
              {user.profilepic ? (
                <img 
                  src={user.profilepic}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
              )}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold truncate" style={{ color: 'hsl(var(--color-foreground))' }}>
                {user.name}
              </h3>
              {user.isPrivate && (
                <Lock className="w-3 h-3 shrink-0 text-gray-500" />
              )}
            </div>
            
            <p className="text-sm truncate" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              @{user.username}
            </p>
            
            {user.bio && (
              <p className="text-xs mt-1 line-clamp-2 text-gray-600" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                {user.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="flex items-center space-x-3 mt-2 text-xs" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              {user.followerCount !== undefined && (
                <span className="flex items-center space-x-1">
                  <span className="font-medium">{user.followerCount}</span>
                  <span>followers</span>
                </span>
              )}
              {user.mutualFollowersCount !== undefined && user.mutualFollowersCount > 0 && (
                <span className="flex items-center space-x-1 text-blue-600">
                  <span className="font-medium">{user.mutualFollowersCount}</span>
                  <span>mutual</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Follow Button */}
        {showFollowButton && (
          <Button
            onClick={handleFollow}
            disabled={loading}
            variant={isFollowing ? 'outline' : 'default'}
            size="sm"
            className="ml-3 shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
