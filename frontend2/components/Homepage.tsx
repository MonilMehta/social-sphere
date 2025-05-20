'use client';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Search, Users, MessageSquare, User, LogOut, Home, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { postsAPI, likesAPI, commentsAPI, usersAPI, followAPI, Post, Comment, User as ApiUser } from '@/lib/api';

interface Chat {
  _id: string;
  user: ApiUser;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

// Sample data for suggested users and chats - replace with API calls
const suggestedUsers: Partial<ApiUser>[] = [
  { _id: '3', name: 'Alice Johnson', username: 'alice_j', email: 'alice@example.com', profilepic: '/1.jpg' },
  { _id: '4', name: 'Bob Wilson', username: 'bob_w', email: 'bob@example.com', profilepic: '/2.jpg' },
  { _id: '5', name: 'Carol Brown', username: 'carol_b', email: 'carol@example.com', profilepic: '/3.jpg' },
];

const recentChats: Chat[] = [
  {
    _id: '1',
    user: { _id: '6', name: 'Mike Davis', username: 'mike_d', email: 'mike@example.com', profilepic: '/4.jpg', followers: 0, following: 0 },
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2 mins ago',
    unreadCount: 2
  },
  {
    _id: '2',
    user: { _id: '7', name: 'Sarah Lee', username: 'sarah_lee', email: 'sarah@example.com', profilepic: '/1.jpg', followers: 0, following: 0 },
    lastMessage: 'Thanks for the help!',
    timestamp: '1 hour ago',
    unreadCount: 0
  },
];

// Navbar Component
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">SocialSphere</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users, posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <PlusCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
            {user && (
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                    <Image
                      src={user.profilepic || '/logo.png'}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white hidden md:block">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Post Component
const PostCard = ({ post, onUpdate }: { post: Post; onUpdate: (updatedPost: Post) => void }) => {
  const [liked, setLiked] = useState(post.hasUserLikedPost);
  const [likeCount, setLikeCount] = useState(post.numberOfLikes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      await likesAPI.togglePostLike(post._id);
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);
      
      // Update the post object
      const updatedPost = {
        ...post,
        hasUserLikedPost: newLiked,
        numberOfLikes: newLiked ? likeCount + 1 : likeCount - 1
      };
      onUpdate(updatedPost);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (comment.trim() && !loading) {
      try {
        setLoading(true);
        await commentsAPI.createComment(post._id, comment);
        setComment('');
        // Optionally refresh comments or update comment count
        const updatedPost = {
          ...post,
          numberOfComments: post.numberOfComments + 1
        };
        onUpdate(updatedPost);
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 overflow-hidden"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
              <Image
                src={post.postedBy.profilepic || '/logo.png'}
                alt={post.postedBy.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{post.postedBy.name}</h3>
            <p className="text-sm text-gray-500">@{post.postedBy.username} • {formatTime(post.createdAt)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 dark:text-white mb-3">{post.caption}</p>
      </div>

      {/* Post Media */}
      {post.mediaFile.length > 0 && (
        <div className="relative">
          <Image
            src={post.mediaFile[0]}
            alt="Post media"
            width={600}
            height={400}
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={loading}
              className={`p-2 ${liked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="p-2 text-gray-500"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-gray-500">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Like and Comment Count */}
        <div className="text-sm text-gray-500 mb-3">
          <span className="font-semibold">{likeCount} likes</span>
          <span className="mx-2">•</span>
          <span>{post.numberOfComments} comments</span>
        </div>

        {/* Add Comment */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            disabled={loading}
          />
          <Button
            onClick={handleComment}
            size="sm"
            disabled={loading || !comment.trim()}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Right Sidebar Component
const RightSidebar = () => {
  const handleFollowUser = async (userId: string) => {
    try {
      await followAPI.followUser(userId);
      // TODO: Update UI to show followed state
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* People to Follow */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          People to Follow
        </h3>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                    <Image
                      src={user.profilepic || '/logo.png'}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-3 py-1"
                onClick={() => user._id && handleFollowUser(user._id)}
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Chats */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Recent Chats
        </h3>
        <div className="space-y-3">
          {recentChats.map((chat) => (
            <div key={chat._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                    <Image
                      src={chat.user.profilepic || '/logo.png'}
                      alt={chat.user.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{chat.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-400">{chat.timestamp}</span>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white">
          View All Chats
        </Button>
      </div>
    </div>
  );
};

// Main Homepage Component
const Homepage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await postsAPI.getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please log in to continue</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view the homepage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Feed</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover what's happening in your network</p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading posts...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  onClick={fetchPosts}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Be the first to share something!</p>
              </div>
            ) : (
              <AnimatePresence>
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onUpdate={handlePostUpdate}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
