'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Mail, 
  Users, 
  Grid3X3, 
  Heart,
  MessageCircle,
  Shield,
  Lock,
  UserPlus,
  UserCheck,
  Edit,
  Settings
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usersAPI, postsAPI, followAPI, User, Post } from '@/lib/api';

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profilepic?: string;
  isVerified: boolean;
  isPrivate: boolean;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  interests?: string[];
  followersCount: number;
  followingsCount: number;
  postsCount: number;
  isFollowing: boolean;
  posts: Post[];
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');

  useEffect(() => {
    if (username) {
      loadUserProfile();
    }
  }, [username]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await usersAPI.getUserProfile(username);
      
      // The API returns an array, get the first item
      const profileData = Array.isArray(profile) ? profile[0] : profile;
      setUserProfile(profileData);
      setIsFollowing(profileData.isFollowing || false);
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Error loading user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!userProfile || followLoading) return;

    setFollowLoading(true);
    try {
      await followAPI.toggleFollow(userProfile._id);
      setIsFollowing(!isFollowing);
      
      // Update follower count
      setUserProfile(prev => prev ? {
        ...prev,
        followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      } : null);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The user you are looking for does not exist.'}</p>
          <Link href="/home">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b" style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}>
        <div className="flex items-center space-x-4">
          <Link href="/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'hsl(var(--color-foreground))' }}>
              {userProfile.name}
            </h1>
            <p className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              {userProfile.postsCount} posts
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {/* Profile Image and Basic Info */}
          <div className="flex items-start space-x-6 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4" style={{ borderColor: 'hsl(var(--color-border))' }}>
                {userProfile.profilepic ? (
                  <Image
                    src={userProfile.profilepic}
                    alt={userProfile.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-muted))' }}>
                    <Users className="w-12 h-12" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--color-foreground))' }}>
                    {userProfile.name}
                  </h2>
                  {userProfile.isVerified && (
                    <Shield className="w-5 h-5 text-blue-500" />
                  )}
                  {userProfile.isPrivate && (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    variant={isFollowing ? 'outline' : 'default'}
                    className="min-w-[100px]"
                  >
                    {followLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-lg mb-2" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                @{userProfile.username}
              </p>

              {userProfile.bio && (
                <p className="mb-4" style={{ color: 'hsl(var(--color-foreground))' }}>
                  {userProfile.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="text-center">
                  <span className="block text-xl font-bold" style={{ color: 'hsl(var(--color-foreground))' }}>
                    {userProfile.postsCount}
                  </span>
                  <span className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                    Posts
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold" style={{ color: 'hsl(var(--color-foreground))' }}>
                    {userProfile.followersCount}
                  </span>
                  <span className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                    Followers
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold" style={{ color: 'hsl(var(--color-foreground))' }}>
                    {userProfile.followingsCount}
                  </span>
                  <span className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                    Following
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                {userProfile.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
                {userProfile.website && (
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {userProfile.website}
                    </a>
                  </div>
                )}
                {userProfile.dateOfBirth && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Born {new Date(userProfile.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: 'hsl(var(--color-border))' }}>
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3X3 className="w-5 h-5 mx-auto mb-1" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'likes'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="w-5 h-5 mx-auto mb-1" />
              Likes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div>
              {userProfile.posts && userProfile.posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProfile.posts.map((post) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                      style={{ 
                        backgroundColor: 'hsl(var(--color-card))',
                        borderColor: 'hsl(var(--color-border))' 
                      }}
                    >
                      {post.mediaFile && post.mediaFile.length > 0 && (
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={post.mediaFile[0]}
                            alt={post.caption}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex items-center space-x-4 text-white">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-5 h-5" />
                                <span>{post.numberOfLikes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.numberOfComments}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-sm line-clamp-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                          {post.caption}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>{post.numberOfLikes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{post.numberOfComments}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Grid3X3 className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                    No posts yet
                  </h3>
                  <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                    This user hasn't shared any posts yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                Liked posts
              </h3>
              <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                Posts liked by this user are private.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
