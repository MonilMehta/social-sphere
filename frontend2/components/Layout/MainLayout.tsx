'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navigation/Navbar';
import PostsFeed from '@/components/Posts/PostsFeed';
import { CreatePost } from '@/components/Posts/CreatePost';
import RecommendedUsers from '@/components/Users/RecommendedUsers';
import { TrendingHashtags } from '@/components/Hashtags/TrendingHashtags';
import { ChatComponent } from '@/components/Chat/ChatComponent';
import SearchComponent from '@/components/Search/SearchComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Users, Hash, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MainLayout() {
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onSearchToggle={toggleMobileSearch} 
        isSearchVisible={isMobileSearchVisible} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <RecommendedUsers />
            <TrendingHashtags className="sticky top-20" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            <CreatePost onPostCreated={handlePostCreated} />
            <PostsFeed key={refreshTrigger} />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <ChatComponent className="sticky top-20" />
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="home" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
            </TabsList>            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="home" className="mt-0 space-y-6">
                  <CreatePost onPostCreated={handlePostCreated} />
                  <PostsFeed key={refreshTrigger} />
                </TabsContent>

                <TabsContent value="users" className="mt-0">
                  <RecommendedUsers />
                </TabsContent>

                <TabsContent value="trending" className="mt-0">
                  <TrendingHashtags />
                </TabsContent>

                <TabsContent value="messages" className="mt-0">
                  <ChatComponent />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>

        {/* Quick Stats Card for Mobile */}
        <div className="lg:hidden mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
