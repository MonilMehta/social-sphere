import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        special: ['Playfair Display', 'serif'],
      },
      colors: {
        // Cream theme colors
        cream: {
          50: '#FEFBF6',   // Primary background
          100: '#F7F3ED',  // Secondary background
          200: '#E8E1D8',  // Border
          300: '#D4A574',  // Accent
          400: '#C19B63',  // Accent hover
          500: '#9A9A9A',  // Text muted
          700: '#6B6B6B',  // Text secondary
          900: '#2D2A26',  // Text primary
        },
        // Tailwind UI compatibility
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))",
          foreground: "hsl(var(--color-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'minimalist': '0 1px 3px 0 rgba(45, 42, 38, 0.1), 0 1px 2px 0 rgba(45, 42, 38, 0.06)',
        'minimalist-md': '0 4px 6px -1px rgba(45, 42, 38, 0.1), 0 2px 4px -1px rgba(45, 42, 38, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
       
