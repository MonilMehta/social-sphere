'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Loader2, TrendingUp, Users, Hash, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchAPI, SearchResult, TrendingHashtag } from '@/lib/api';
import UserCard from '../Users/UserCard';

interface SearchComponentProps {
  onClose?: () => void;
}

export default function SearchComponent({ onClose }: SearchComponentProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'users' | 'posts'>('all');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchAPI.globalSearch(query, searchType, 1, 10); // Limit to 10 for quick preview
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToFullSearch = () => {
    if (query.trim()) {
      const params = new URLSearchParams({
        q: query.trim(),
        type: searchType
      });
      router.push(`/search?${params.toString()}`);
      onClose?.();
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    const searchQuery = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    const params = new URLSearchParams({
      q: searchQuery,
      type: 'posts'
    });
    router.push(`/search?${params.toString()}`);
    onClose?.();
  };

  const loadTrendingHashtags = async () => {
    try {
      const hashtags = await searchAPI.getTrendingHashtags();
      setTrendingHashtags(hashtags);
    } catch (error) {
      console.error('Failed to load trending hashtags:', error);
    }
  };
  useEffect(() => {
    loadTrendingHashtags();
  }, []);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleEnterToNavigate = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      navigateToFullSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 p-4 rounded-lg border"
        style={{ 
          backgroundColor: 'hsl(var(--color-card))',
          borderColor: 'hsl(var(--color-border))' 
        }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                   style={{ color: 'hsl(var(--color-muted-foreground))' }} />            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleEnterToNavigate}
              placeholder="Search posts, users, hashtags..."
              className="pl-10"
            />
          </div>
          <Button 
            onClick={query.trim() ? navigateToFullSearch : handleSearch}
            disabled={loading}
            className="px-6"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : query.trim() ? 'View All' : 'Search'}
          </Button>
        </div>

        {/* Search Type Filter */}
        <div className="flex space-x-2">
          {[
            { key: 'all' as const, label: 'All', icon: Search },
            { key: 'users' as const, label: 'Users', icon: Users },
            { key: 'posts' as const, label: 'Posts', icon: Hash },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={searchType === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType(key)}
              className="flex items-center space-x-1"
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Trending Hashtags */}
      {!searchResults && trendingHashtags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: 'hsl(var(--color-card))',
            borderColor: 'hsl(var(--color-border))' 
          }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{ color: 'hsl(var(--color-primary))' }} />
            <h3 className="font-semibold" style={{ color: 'hsl(var(--color-foreground))' }}>
              Trending Hashtags
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {trendingHashtags.map((hashtag, index) => (              <button
                key={index}
                onClick={() => handleHashtagClick(hashtag.hashtag)}
                className="text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-600">{hashtag.hashtag}</span>
                  <span className="text-sm text-gray-500">{hashtag.count}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      {searchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Users Results */}
          {searchResults.users && searchResults.users.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(var(--color-foreground))' }}>
                Users ({searchResults.users.length})
              </h3>
              <div className="grid gap-4">
                {searchResults.users.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {searchResults.posts && searchResults.posts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(var(--color-foreground))' }}>
                Posts ({searchResults.posts.length})
              </h3>
              <div className="space-y-4">
                {searchResults.posts.map((post) => (
                  <div
                    key={post._id}
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-card))',
                      borderColor: 'hsl(var(--color-border))' 
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                        {post.postedBy.name}
                      </span>
                      <span className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                        @{post.postedBy.username}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'hsl(var(--color-foreground))' }}>
                      {post.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}          {/* No Results */}
          {(!searchResults.users || searchResults.users.length === 0) && 
           (!searchResults.posts || searchResults.posts.length === 0) && (
            <div className="text-center py-12">
              <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                No results found for "{query}"
              </p>
            </div>
          )}

          {/* View All Results Button */}
          {((searchResults.users && searchResults.users.length > 0) || 
            (searchResults.posts && searchResults.posts.length > 0)) && (
            <div className="text-center pt-4">
              <Button 
                onClick={navigateToFullSearch}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <span>View all results</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
