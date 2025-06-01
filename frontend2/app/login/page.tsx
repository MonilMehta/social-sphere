'use client';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        // Redirect will happen automatically via useEffect
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(var(--color-primary))' }} />
      </div>
    );
  }return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--color-background))' }}>      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Single diagonal marquee - fixed vertical position */}
        <motion.div
          className="absolute text-[8vw] font-bold opacity-20 select-none whitespace-nowrap transform rotate-12 z-0"
          style={{ 
            color: '#94a3b8',
            top: '30%',
            left: '-100%'
          }}
          animate={{ 
            x: ["-100%", "100vw"]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          🔒 SocialFlow ⚡ SocialFlow 🌍 SocialFlow 🔒 SocialFlow ⚡ SocialFlow 🌍 SocialFlow 
        </motion.div>
      </div>
      
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
            <Link href="/home" className="flex items-center">
              {/* Light mode logo */}
              <Image
                src="/logo.png"
                alt="Social Sphere"
                width={200}
                height={100}
                className="h-32 w-auto dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src="/logo-dark.png"
                alt="Social Sphere"
                width={200}
                height={100}
                className="h-32 w-auto hidden dark:block"
                priority
              />
            </Link>
            <div className="flex items-center space-x-4">              <ThemeToggle />              <Link href="/" className="cursor-pointer">
                <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{
                  borderColor: 'hsl(var(--color-border))',
                  color: 'hsl(var(--color-foreground))'
                }}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>      {/* Login Form */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 shadow-2xl border backdrop-blur-sm"
            style={{ 
              backgroundColor: 'hsl(var(--color-card) / 0.95)',
              borderColor: 'hsl(var(--color-border))' 
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                style={{ 
                  background: 'hsl(var(--color-primary))'
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Lock className="w-8 h-8" style={{ color: 'hsl(var(--color-primary-foreground))' }} />
              </motion.div>
              <motion.h1 
                className="text-3xl font-light mb-2" 
                style={{ color: 'hsl(var(--color-foreground))' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back
              </motion.h1>
              <motion.p 
                style={{ color: 'hsl(var(--color-muted-foreground))' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Sign in to your SocialFlow account
              </motion.p>
            </div>            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'hsl(var(--color-destructive) / 0.1)',
                    borderColor: 'hsl(var(--color-destructive) / 0.3)',
                    color: 'hsl(var(--color-destructive))'
                  }}
                >
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'hsl(var(--color-primary) / 0.1)',
                    borderColor: 'hsl(var(--color-primary) / 0.3)',
                    color: 'hsl(var(--color-primary))'
                  }}
                >
                  {success}
                </motion.div>
              )}{/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 cursor-pointer hover:scale-110"
                    style={{ color: 'hsl(var(--color-muted-foreground))' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cream-300 bg-cream-100 border-cream-200 rounded focus:ring-cream-300 cursor-pointer"
                  />
                  <span className="ml-2 text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>Remember me</span>
                </label>                <a href="#" className="text-sm transition-all duration-300 cursor-pointer hover:underline" style={{ color: 'hsl(var(--color-primary))' }}>
                  Forgot password?
                </a>
              </div>              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-lg cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'hsl(var(--color-primary))',
                    color: 'hsl(var(--color-primary-foreground))'
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>            {/* Divider */}
            <div className="relative my-6">
              <div className="relative flex justify-center text-sm">
                <span style={{ 
                  color: 'hsl(var(--color-muted-foreground))'
                }}>
                  Don't have an account?
                </span>
              </div>
            </div>{/* Sign up link */}
            <div className="text-center">
              <Link href="/signup" className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >                  <Button variant="outline" className="w-full cursor-pointer transition-all duration-300 hover:shadow-md" style={{
                    borderColor: 'hsl(var(--color-border))',
                    color: 'hsl(var(--color-foreground))'
                  }}>
                    Create an account
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
