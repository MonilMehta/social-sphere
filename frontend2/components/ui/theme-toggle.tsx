'use client';

import { Lamp, Sun } from 'lucide-react';
import { Button } from './button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.style.setProperty('--color-background', '20 10% 10%');        // Dark brown
      root.style.setProperty('--color-foreground', '42 15% 95%');        // Cream white
      root.style.setProperty('--color-card', '20 10% 15%');              // Dark card
      root.style.setProperty('--color-card-foreground', '42 15% 95%');   // Cream white
      root.style.setProperty('--color-popover', '20 10% 15%');           // Dark popover
      root.style.setProperty('--color-popover-foreground', '42 15% 95%'); // Cream white
      root.style.setProperty('--color-primary', '42 15% 95%');           // Cream white for primary
      root.style.setProperty('--color-primary-foreground', '20 10% 10%'); // Dark brown
      root.style.setProperty('--color-secondary', '20 10% 15%');         // Dark secondary
      root.style.setProperty('--color-secondary-foreground', '42 15% 95%'); // Cream white
      root.style.setProperty('--color-muted', '20 10% 15%');             // Dark muted
      root.style.setProperty('--color-muted-foreground', '35 10% 75%');  // Light cream
      root.style.setProperty('--color-accent', '34 40% 64%');            // Keep gold accent
      root.style.setProperty('--color-accent-foreground', '20 10% 10%'); // Dark brown
      root.style.setProperty('--color-border', '20 10% 20%');            // Dark border
      root.style.setProperty('--color-input', '20 10% 20%');             // Dark input
      root.style.setProperty('--color-ring', '34 40% 64%');              // Gold ring
      
      // Update cream colors for dark mode
      root.style.setProperty('--color-cream-50', '20 10% 10%');          // Dark background
      root.style.setProperty('--color-cream-100', '20 10% 15%');         // Dark secondary
      root.style.setProperty('--color-cream-200', '20 10% 20%');         // Dark border
      root.style.setProperty('--color-cream-300', '34 40% 64%');         // Keep gold
      root.style.setProperty('--color-cream-500', '35 10% 65%');         // Light muted
      root.style.setProperty('--color-cream-700', '35 10% 75%');         // Light secondary
      root.style.setProperty('--color-cream-900', '42 15% 95%');         // Cream white
    } else {
      // Light mode (default values)
      root.style.setProperty('--color-background', '42 15% 98%');        // cream-50
      root.style.setProperty('--color-foreground', '30 10% 16%');        // cream-900
      root.style.setProperty('--color-card', '0 0% 100%');               // white
      root.style.setProperty('--color-card-foreground', '30 10% 16%');   // cream-900
      root.style.setProperty('--color-popover', '0 0% 100%');            // white
      root.style.setProperty('--color-popover-foreground', '30 10% 16%'); // cream-900
      root.style.setProperty('--color-primary', '30 10% 16%');           // cream-900
      root.style.setProperty('--color-primary-foreground', '0 0% 100%'); // white
      root.style.setProperty('--color-secondary', '35 22% 95%');         // cream-100
      root.style.setProperty('--color-secondary-foreground', '30 10% 16%'); // cream-900
      root.style.setProperty('--color-muted', '35 22% 95%');             // cream-100
      root.style.setProperty('--color-muted-foreground', '0 0% 42%');    // cream-700
      root.style.setProperty('--color-accent', '34 40% 64%');            // cream-300
      root.style.setProperty('--color-accent-foreground', '30 10% 16%'); // cream-900
      root.style.setProperty('--color-border', '35 15% 88%');            // cream-200
      root.style.setProperty('--color-input', '35 15% 88%');             // cream-200
      root.style.setProperty('--color-ring', '30 10% 16%');              // cream-900
      
      // Reset cream colors to light mode
      root.style.setProperty('--color-cream-50', '42 15% 98%');
      root.style.setProperty('--color-cream-100', '35 22% 95%');
      root.style.setProperty('--color-cream-200', '35 15% 88%');
      root.style.setProperty('--color-cream-300', '34 40% 64%');
      root.style.setProperty('--color-cream-500', '0 0% 60%');
      root.style.setProperty('--color-cream-700', '0 0% 42%');
      root.style.setProperty('--color-cream-900', '30 10% 16%');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >      {theme === 'light' ? (
        <Lamp className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
