'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage(): React.JSX.Element {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('https://social-sphere-xzkh.onrender.com/api/v1/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User registered successfully:', data);
          // Redirect to login page
          window.location.href = '/login';
        } else {
          const errorData = await response.json();
          setErrors({ submit: errorData.message || 'Registration failed' });
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setErrors({ submit: 'An error occurred while registering. Please try again later.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
      {/* Animated Background */}
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
      >        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              {/* Light mode logo */}
              <Image
                src="/logo.png"
                alt="Social Sphere"
                width={200}
                height={60}
                className="h-32 w-auto dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src="/logo-dark.png"
                alt="Social Sphere"
                width={200}
                height={60}
                className="h-32 w-auto hidden dark:block"
                priority
              />
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/" className="cursor-pointer">
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
      </motion.nav>

      {/* Signup Form */}
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
            <div className="text-center mb-8">
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                style={{ 
                  background: 'hsl(var(--color-primary))'
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="w-8 h-8" style={{ color: 'hsl(var(--color-primary-foreground))' }} />
              </motion.div>
              <motion.h1 
                className="text-3xl font-light mb-2" 
                style={{ color: 'hsl(var(--color-foreground))' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Join SocialFlow
              </motion.h1>
              <motion.p 
                style={{ color: 'hsl(var(--color-muted-foreground))' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Create your account and start connecting
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: errors.fullName ? '#ef4444' : 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: errors.username ? '#ef4444' : 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Choose a username"
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: errors.email ? '#ef4444' : 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: errors.password ? '#ef4444' : 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Create a strong password"
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: 'hsl(var(--color-foreground))' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--color-muted-foreground))' }} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-300 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg cursor-text"
                    style={{ 
                      backgroundColor: 'hsl(var(--color-muted))',
                      borderColor: errors.confirmPassword ? '#ef4444' : 'hsl(var(--color-border))',
                      color: 'hsl(var(--color-foreground))'
                    }}
                    placeholder="Confirm your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 cursor-pointer hover:scale-110"
                    style={{ color: 'hsl(var(--color-muted-foreground))' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms & Privacy */}
              <div className="text-sm" style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                By creating an account, you agree to our{' '}
                <a href="#" className="transition-all duration-300 cursor-pointer hover:underline" style={{ color: 'hsl(var(--color-primary))' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="transition-all duration-300 cursor-pointer hover:underline" style={{ color: 'hsl(var(--color-primary))' }}>
                  Privacy Policy
                </a>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="text-sm text-red-500 text-center">{errors.submit}</div>
              )}              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-lg cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl focus:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: 'hsl(var(--color-primary))',
                    color: 'hsl(var(--color-primary-foreground))',
                    boxShadow: '0 10px 25px -5px hsl(var(--color-primary) / 0.4), 0 8px 10px -6px hsl(var(--color-primary) / 0.2)'
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </form>            {/* Divider */}
            <div className="relative my-6">
              <div className="relative flex justify-center text-sm">
                <span style={{ 
                  color: 'hsl(var(--color-muted-foreground))'
                }}>
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <Link href="/login" className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="w-full cursor-pointer transition-all duration-300 hover:shadow-md" style={{
                    borderColor: 'hsl(var(--color-border))',
                    color: 'hsl(var(--color-foreground))'
                  }}>
                    Sign in to your account
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
