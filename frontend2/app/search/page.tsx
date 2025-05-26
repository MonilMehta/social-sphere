'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Hash, FileText, TrendingUp, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchAPI, SearchResult, TrendingHashtag, Post, User } from '@/lib/api';
import PostCard from '@/components/Posts/PostCard';
import UserCard from '@/components/Users/UserCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const initialQuery = searchParams?.get('q');
    const initialType = searchParams?.get('type') as 'all' | 'users' | 'posts';
    
    if (initialQuery) {
      setQuery(initialQuery);
      setActiveTab(initialType || 'all');
      handleSearch(initialQuery, initialType || 'all');
    } else {
      loadTrendingHashtags();
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string = query, type: 'all' | 'users' | 'posts' = activeTab, page: number = 1) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchAPI.globalSearch(searchQuery, type, page, 20);
      
      if (page === 1) {
        setSearchResults(results);
      } else {
        // Append results for pagination
        setSearchResults(prev => ({
          users: type === 'users' || type === 'all' 
            ? [...(prev?.users || []), ...(results.users || [])]
            : prev?.users || [],
          posts: type === 'posts' || type === 'all'
            ? [...(prev?.posts || []), ...(results.posts || [])]
            : prev?.posts || [],
          hashtags: results.hashtags || prev?.hashtags || []
        }));
      }
      
      setCurrentPage(page);
      // Check if there are more results (assuming API returns 20 items when there are more)
      setHasMore((results.users?.length || 0) + (results.posts?.length || 0) >= 20);
      
      // Update URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('q', searchQuery);
      newUrl.searchParams.set('type', type);
      window.history.replaceState({}, '', newUrl.toString());
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingHashtags = async () => {
    try {
      const hashtags = await searchAPI.getTrendingHashtags(20);
      setTrendingHashtags(hashtags);
    } catch (error) {
      console.error('Failed to load trending hashtags:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      handleSearch();
    }
  };
  const handleTabChange = (newTab: string) => {
    const validTab = newTab as 'all' | 'users' | 'posts';
    setActiveTab(validTab);
    setCurrentPage(1);
    if (query.trim()) {
      handleSearch(query, validTab, 1);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    const searchQuery = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    setQuery(searchQuery);
    setActiveTab('posts');
    setCurrentPage(1);
    handleSearch(searchQuery, 'posts', 1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      handleSearch(query, activeTab, currentPage + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Search</h1>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search posts, users, hashtags..."
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-6"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        {searchResults ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>All</span>
                {(searchResults.users?.length || 0) + (searchResults.posts?.length || 0) > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {(searchResults.users?.length || 0) + (searchResults.posts?.length || 0)}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
                {searchResults.users && searchResults.users.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {searchResults.users.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Posts</span>
                {searchResults.posts && searchResults.posts.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {searchResults.posts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* All Results Tab */}
            <TabsContent value="all" className="space-y-6">
              {/* Users Section */}
              {searchResults.users && searchResults.users.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Users ({searchResults.users.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchResults.users.slice(0, 4).map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                  {searchResults.users.length > 4 && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('users')}
                    >
                      View all {searchResults.users.length} users
                    </Button>
                  )}
                </section>
              )}

              {/* Posts Section */}
              {searchResults.posts && searchResults.posts.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Posts ({searchResults.posts.length})
                  </h2>
                  <div className="space-y-4">
                    {searchResults.posts.slice(0, 3).map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                  {searchResults.posts.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('posts')}
                    >
                      View all {searchResults.posts.length} posts
                    </Button>
                  )}
                </section>
              )}

              {/* No Results */}
              {(!searchResults.users || searchResults.users.length === 0) && 
               (!searchResults.posts || searchResults.posts.length === 0) && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching for different keywords or check the spelling.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              {searchResults.users && searchResults.users.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchResults.users.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="text-center pt-4">
                      <Button onClick={loadMore} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Load more users
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts">
              {searchResults.posts && searchResults.posts.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                  {hasMore && (
                    <div className="text-center pt-4">
                      <Button onClick={loadMore} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Load more posts
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or hashtags.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          /* Trending Hashtags when no search */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Trending Hashtags</h2>
              </div>
              
              {trendingHashtags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingHashtags.map((hashtag, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleHashtagClick(hashtag.hashtag)}
                      className="text-left p-4 rounded-lg border hover:bg-accent transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-primary" />
                            <span className="font-medium text-primary">
                              {hashtag.hashtag}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {hashtag.count} posts
                          </p>
                        </div>
                        <Badge variant="secondary">{index + 1}</Badge>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No trending hashtags at the moment</p>
                </div>
              )}
            </div>

            {/* Search Suggestions */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Search Suggestions</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {['#javascript', '#react', '#nextjs', '#programming', '#coding', '#webdev'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleHashtagClick(suggestion)}
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/80 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
