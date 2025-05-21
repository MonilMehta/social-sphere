'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HomeRoute() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(var(--color-primary))' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ 
        backgroundColor: 'hsl(var(--color-card))',
        borderColor: 'hsl(var(--color-border))' 
      }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold" style={{ color: 'hsl(var(--color-foreground))' }}>
              SocialFlow
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                <span style={{ color: 'hsl(var(--color-foreground))' }}>
                  {user?.name || user?.username}
                </span>
              </div>
              
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: 'hsl(var(--color-border))',
                  color: 'hsl(var(--color-foreground))'
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'hsl(var(--color-foreground))' }}>
            Welcome to SocialFlow! 🎉
          </h2>
          
          <p className="text-lg mb-8" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
            You have successfully logged in. Your dashboard will be coming soon!
          </p>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto p-6 rounded-xl border shadow-lg"
            style={{ 
              backgroundColor: 'hsl(var(--color-card))',
              borderColor: 'hsl(var(--color-border))' 
            }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--color-foreground))' }}>
              Your Profile
            </h3>
            
            <div className="space-y-2 text-left">
              <div>
                <span className="font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>Name: </span>
                <span style={{ color: 'hsl(var(--color-muted-foreground))' }}>{user?.name}</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>Username: </span>
                <span style={{ color: 'hsl(var(--color-muted-foreground))' }}>@{user?.username}</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>Email: </span>
                <span style={{ color: 'hsl(var(--color-muted-foreground))' }}>{user?.email}</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>Account Type: </span>
                <span style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                  {user?.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
              <div>
                <span className="font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>Verified: </span>
                <span style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                  {user?.isVerified ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
