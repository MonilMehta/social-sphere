'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle signup logic here
      console.log('Signup submitted:', formData);
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
  };  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: 'hsl(var(--color-background))' }}>
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block mb-6">
            <div className="w-16 h-16 mx-auto">
              <Image
                src="/logo.png"
                alt="SocialFlow Logo"
                width={100}
                height={80}
                className="rounded-lg"
              />
            </div>
          </Link>          <h1 className="text-3xl font-light mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
            Join <span className="font-special italic text-cream-300">SocialFlow</span>
          </h1>
          <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
            Create your account and start connecting
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl p-8 shadow-minimalist-md border"
          style={{ 
            backgroundColor: 'hsl(var(--color-card))',
            borderColor: 'hsl(var(--color-border))' 
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-300 transition-all ${
                    errors.fullName ? 'border-red-300 focus:ring-red-300' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'hsl(var(--color-muted))',
                    borderColor: errors.fullName ? '#fca5a5' : 'hsl(var(--color-border))',
                    color: 'hsl(var(--color-foreground))'
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-300 transition-all ${
                    errors.email ? 'border-red-300 focus:ring-red-300' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'hsl(var(--color-muted))',
                    borderColor: errors.email ? '#fca5a5' : 'hsl(var(--color-border))',
                    color: 'hsl(var(--color-foreground))'
                  }}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-2xl placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-300 transition-all ${
                    errors.password ? 'border-red-300 focus:ring-red-300' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'hsl(var(--color-muted))',
                    borderColor: errors.password ? '#fca5a5' : 'hsl(var(--color-border))',
                    color: 'hsl(var(--color-foreground))'
                  }}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream-500 hover:text-cream-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--color-foreground))' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-2xl placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-300 transition-all ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-300' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'hsl(var(--color-muted))',
                    borderColor: errors.confirmPassword ? '#fca5a5' : 'hsl(var(--color-border))',
                    color: 'hsl(var(--color-foreground))'
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream-500 hover:text-cream-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Privacy */}
            <div className="text-sm text-cream-600 dark:text-cream-600">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-cream-300 dark:text-cream-300 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-cream-300 dark:text-cream-300 hover:underline">
                Privacy Policy
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-cream-900 dark:bg-cream-300 text-white dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 py-3 text-lg font-medium"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-cream-700 dark:text-cream-700">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-cream-300 dark:text-cream-300 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link 
            href="/" 
            className="text-cream-600 dark:text-cream-600 hover:text-cream-800 dark:hover:text-cream-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
