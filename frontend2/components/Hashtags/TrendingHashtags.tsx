'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchAPI, TrendingHashtag } from '@/lib/api';
import { Hash, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface TrendingHashtagsProps {
  className?: string;
  limit?: number;
}

export function TrendingHashtags({ className, limit = 10 }: TrendingHashtagsProps) {
  const router = useRouter();
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await searchAPI.getTrendingHashtags(limit);
        setHashtags(data);
      } catch (err) {
        console.error('Error fetching trending hashtags:', err);
        setError('Failed to load trending hashtags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingHashtags();
  }, [limit]);

  const handleHashtagClick = (hashtag: string) => {
    const searchQuery = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    const params = new URLSearchParams({
      q: searchQuery,
      type: 'posts'
    });
    router.push(`/search?${params.toString()}`);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <TrendingUp className="w-5 h-5 mr-2" />
            Error Loading Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (            <div key={index} className="flex items-center space-x-3">
              <Skeleton className="w-6 h-6 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
          ))
        ) : hashtags.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No trending hashtags found
          </p>
        ) : (          hashtags.map((hashtag, index) => (
            <motion.button
              key={hashtag.hashtag}
              onClick={() => handleHashtagClick(hashtag.hashtag)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {hashtag.hashtag}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCount(hashtag.count)} posts
                  </p>
                </div>
              </div>              <Badge variant="secondary" className="text-xs">
                #{index + 1}
              </Badge>
            </motion.button>
          ))
        )}
      </CardContent>
    </Card>
  );
}
