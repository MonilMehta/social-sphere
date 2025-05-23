'use client';
import { useState } from 'react';
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

  const handleFollow = async () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
      style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: 'hsl(var(--color-muted))' }}>
            {user.profilepic ? (
              <img 
                src={user.profilepic} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold" style={{ color: 'hsl(var(--color-foreground))' }}>
                {user.name}
              </h3>
              {user.isVerified && (
                <Shield className="w-4 h-4 text-blue-500" />
              )}
              {user.isPrivate && (
                <Lock className="w-4 h-4 text-gray-500" />
              )}
            </div>
            
            <p className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              @{user.username}
            </p>
            
            {user.bio && (
              <p className="text-xs mt-1 line-clamp-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                {user.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="flex items-center space-x-4 mt-2 text-xs" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              {user.followerCount !== undefined && (
                <span>{user.followerCount} followers</span>
              )}
              {user.followingCount !== undefined && (
                <span>{user.followingCount} following</span>
              )}
              {user.mutualFollowersCount !== undefined && user.mutualFollowersCount > 0 && (
                <span className="text-blue-600">{user.mutualFollowersCount} mutual</span>
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
            className="ml-4"
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
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
