'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import  SearchComponent  from '@/components/Search/SearchComponent';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell, MessageCircle, User, LogOut, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

interface NavbarProps {
  onSearchToggle?: () => void;
  isSearchVisible?: boolean;
}

export function Navbar({ onSearchToggle, isSearchVisible }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-background/95 support-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link href="/home" className="flex items-center">
              {/* Light mode logo */}
              <Image
                src="/logo.png"
                alt="socialflow"
                width={200}
                height={100}
                className="h-32 w-auto dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src="/logo-dark.png"
                alt="socialflow"
                width={200}
                height={100}
                className="h-32 w-auto hidden dark:block"
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-4 h-4 mr-2" />
                Search posts, users, hashtags...
              </Button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg z-50"
                  >
                    <SearchComponent onClose={() => setIsSearchOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onSearchToggle}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-5 h-5" />
            </Button>            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    {user?.profilepic ? (
                      <>
                        <Image
                          src={user.profilepic}
                          alt={user.name || user.username || 'Profile'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget;
                            const fallback = img.parentElement?.querySelector('.fallback-icon');
                            if (img.parentElement && fallback) {
                              img.style.display = 'none';
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <User className="w-4 h-4 fallback-icon" style={{ display: 'none' }} />
                      </>
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline">{user?.name || user?.username}</span>
                </Button>
              </DropdownMenuTrigger>              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    {user?.profilepic ? (
                      <>
                        <Image
                          src={user.profilepic}
                          alt={user.name || user.username || 'Profile'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget;
                            const fallback = img.parentElement?.querySelector('.fallback-icon');
                            if (img.parentElement && fallback) {
                              img.style.display = 'none';
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <User className="w-4 h-4 fallback-icon" style={{ display: 'none' }} />
                      </>
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{user?.username}
                    </p>
                  </div>
                </div><DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user?.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="p-4">
              <SearchComponent onClose={onSearchToggle} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
