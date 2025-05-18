'use client';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 backdrop-blur-sm border-b"
        style={{ 
          backgroundColor: 'hsl(var(--color-card) / 0.9)',
          borderColor: 'hsl(var(--color-border))' 
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.png"
                  alt="SocialFlow Logo"
                  width={100}
                  height={80}
                  className="rounded-lg"
                />
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />              <Link href="/">
                <Button variant="outline" size="sm" className="border-cream-300 text-cream-700 hover:bg-cream-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Login Form */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 shadow-minimalist-md border"
            style={{ 
              backgroundColor: 'hsl(var(--color-card))',
              borderColor: 'hsl(var(--color-border))' 
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-cream-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-light mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                Welcome back
              </h1>
              <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                Sign in to your SocialFlow account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-500" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-colors"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-colors"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream-500 hover:text-cream-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cream-300 bg-cream-100 border-cream-200 rounded focus:ring-cream-300"
                  />
                  <span className="ml-2 text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>Remember me</span>
                </label>
                <a href="#" className="text-sm text-cream-300 hover:text-cream-400 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-cream-300 text-white hover:bg-cream-400 py-3 text-lg"
              >
                Sign In
              </Button>
            </form>            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'hsl(var(--color-border))' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ 
                  backgroundColor: 'hsl(var(--color-card))',
                  color: 'hsl(var(--color-muted-foreground))'
                }}>
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <Link href="/signup">
                <Button variant="outline" className="w-full border-cream-200 text-cream-700 hover:bg-cream-100">
                  Create an account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
