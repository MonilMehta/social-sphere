'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User, searchAPI } from '@/lib/api';
import UserCard from './UserCard';

export default function RecommendedUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendedUsers();
  }, []);

  const loadRecommendedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchAPI.getRecommendedUsers(1, 10);
      setUsers(response.users);
    } catch (err) {
      setError('Failed to load recommended users');
      console.error('Error loading recommended users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecommendedUsers();
    setRefreshing(false);
  };

  const handleFollow = (userId: string) => {
    // Optionally update local state or refresh recommendations
    console.log('User followed:', userId);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg border" style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'hsl(var(--color-primary))' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border" style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}>
        <div className="text-center py-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadRecommendedUsers} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-lg border"
      style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" style={{ color: 'hsl(var(--color-primary))' }} />
          <h3 className="font-semibold" style={{ color: 'hsl(var(--color-foreground))' }}>
            Recommended for You
          </h3>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Users List */}
      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              showFollowButton={true}
              onFollow={handleFollow}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
          <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
            No recommendations available right now.
          </p>
        </div>
      )}
    </motion.div>
  );
}
