'use client';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowRight, Users, MessageCircle, Shield, Heart, Lock, LockOpen, Star, Menu, X, ChevronRight, Sparkles, Zap, Globe, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from 'clsx';
import DiscoBallComponent from "@/components/ui/disco-ball";
import './globals.css';

// TypeScript interfaces
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  span: string;
}

interface Stat {
  number: string;
  label: string;
}

interface Testimonial {
  name: string;
  handle: string;
  content: string;
  avatar: string;
  gradient: string;
}

// Mobile Menu Component
const MobileMenu = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <>
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`fixed right-0 top-0 h-full w-64 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white/95 dark:bg-cream-200/95 backdrop-blur-md shadow-xl`}>
          <div className="flex items-center justify-between p-6 border-b border-cream-200 dark:border-cream-300">
            <span className="text-lg font-semibold text-cream-900 dark:text-cream-900">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-cream-700 dark:text-cream-700" />
            </button>
          </div>
          <nav className="p-6 space-y-6">
            <a href="#features" className="block font-medium text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#privacy" className="block font-medium text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors" onClick={() => setIsOpen(false)}>Privacy</a>
            <a href="#community" className="block font-medium text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors" onClick={() => setIsOpen(false)}>Community</a>
            <div className="pt-6 border-t space-y-4 border-cream-200 dark:border-cream-300">
              <Link href="/login">
                <button className="w-full px-4 py-2 border border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-100 dark:hover:bg-cream-200 rounded-lg font-medium transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="w-full px-4 py-2 bg-cream-900 dark:bg-cream-300 text-cream-50 dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 rounded-lg font-medium transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

// Floating Elements Background with Twinkling Stars
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid-based star layout for even spacing */}
      {[...Array(6)].map((_, row) => (
        [...Array(8)].map((_, col) => (
          <Star
            key={`${row}-${col}`}
            className="absolute text-cream-300/30 dark:text-cream-300/40"
            style={{
              left: `${(col * 12.5) + (Math.random() * 8)}%`,
              top: `${(row * 16.67) + (Math.random() * 10)}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${8 + Math.random() * 8}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite alternate`
            }}
          />
        ))
      )).flat()}
      
      <style jsx>{`
        @keyframes twinkle {
          0% { 
            opacity: 0.2; 
            transform: scale(0.8) rotate(${Math.random() * 360}deg); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2) rotate(${Math.random() * 360}deg); 
          }
          100% { 
            opacity: 0.3; 
            transform: scale(0.9) rotate(${Math.random() * 360}deg); 
          }
        }
      `}</style>
    </div>
  );
};
// Enhanced Image Carousel Component
const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <div 
      className="relative inline-block w-24 h-24 ml-4 align-middle cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden border-3 border-cream-300 dark:border-cream-300 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br from-cream-100 to-cream-200 dark:from-cream-200 dark:to-cream-300">
        {images.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 0.8
            }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={image}
              alt={`Moment ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full animate-ping bg-cream-300/30 dark:bg-cream-300/40" style={{ animationDuration: '3s' }} />
      
      {/* Small indicators */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-cream-300 dark:bg-cream-300' 
                : 'bg-cream-200 dark:bg-cream-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Animated Lock Component
const AnimatedLock = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUnlocked(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-block ml-3 mr-3 align-middle"
      animate={{ 
        rotateY: [0, 15, -15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div
          className={clsx(
            'transition-transform duration-700 ease-in-out',
            isUnlocked ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
          )}
        >
          {isUnlocked ? (
            <LockOpen className="w-12 h-12 text-green-500 dark:text-green-400 transition-colors duration-500" />
          ) : (
            <Lock className="w-12 h-12 text-cream-300 dark:text-cream-300 transition-colors duration-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Feature Card with advanced animations
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-700 cursor-pointer ${
        'bg-gradient-to-br from-white/80 via-white/60 to-cream-50/80 dark:from-cream-200/80 dark:via-cream-200/60 dark:to-cream-300/80 border border-cream-200/40 dark:border-cream-300/40 hover:border-cream-300/60 dark:hover:border-cream-400/60 shadow-lg shadow-cream-300/10 dark:shadow-cream-400/10 hover:shadow-cream-300/20 dark:hover:shadow-cream-400/20'
      } backdrop-blur-lg hover:shadow-2xl hover:-translate-y-3 hover:rotate-1 ${feature.span}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1
      }}
      viewport={{ once: true }}
      style={{
        animationDelay: `${index * 0.15}s`
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-700 bg-gradient-to-br from-cream-300/30 dark:from-cream-400/30 via-cream-400/20 dark:via-cream-500/20 to-cream-500/30 dark:to-cream-600/30" />
      
      {/* Floating particles on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-ping bg-cream-300 dark:bg-cream-400"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Icon container with enhanced styling */}
      <motion.div 
        className="w-16 h-16 bg-cream-900 dark:bg-cream-300 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg shadow-cream-300/20 dark:shadow-cream-400/20"
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
      >
        <feature.icon className="w-8 h-8 text-cream-50 dark:text-cream-900 transition-all duration-500" />
        
        {/* Icon glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-all duration-500 bg-cream-300/20 dark:bg-cream-400/30 blur-md" />
        
        {/* Rotating border */}
        <div className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 border-cream-300/50 dark:border-cream-400/50 animate-spin" style={{ animationDuration: '3s' }} />
      </motion.div>
      
      {/* Content with better typography */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-4 transition-all duration-500 text-cream-900 dark:text-cream-900 group-hover:text-cream-800 dark:group-hover:text-cream-800">
          {feature.title}
        </h3>
        
        <p className="text-lg leading-relaxed transition-all duration-500 text-cream-700 dark:text-cream-700 group-hover:text-cream-600 dark:group-hover:text-cream-600">
          {feature.description}
        </p>
      </div>
      
      {/* Enhanced hover elements */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 text-cream-300 dark:text-cream-400">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Explore</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Corner decoration with animation */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 bg-gradient-to-bl from-cream-300/40 dark:from-cream-400/40 via-cream-400/30 dark:via-cream-500/30 to-transparent" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
        {/* Bottom highlight line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-cream-300 dark:from-cream-400 via-cream-400 dark:via-cream-500 to-cream-500 dark:to-cream-600" />
    </motion.div>
  );
};

// Enhanced Stats Component
const StatsCard = ({ stat, index }: { stat: Stat; index: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`stat-${index}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    if (isVisible && stat.number !== "Coming Soon" && stat.number !== "24/7") {
      const target = parseInt(stat.number.replace('%', ''));
      const increment = target / 50;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isVisible, stat.number]);

  return (
    <motion.div
      id={`stat-${index}`}
      className="group relative p-8 rounded-3xl transition-all duration-700 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white/70 dark:from-cream-200/70 via-white/50 dark:via-cream-200/50 to-cream-50/70 dark:to-cream-300/70 border border-cream-200/30 dark:border-cream-300/30 hover:border-cream-300/50 dark:hover:border-cream-400/50 backdrop-blur-lg hover:shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br from-cream-300 dark:from-cream-400 to-cream-400 dark:to-cream-500" />
      
      {/* Icon with enhanced styling */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br from-cream-900/20 dark:from-cream-300/20 to-cream-800/20 dark:to-cream-400/20 shadow-lg shadow-cream-300/10 dark:shadow-cream-400/20">
        {index === 0 && <Sparkles className="w-7 h-7 transition-colors duration-300 text-cream-300 dark:text-cream-400" />}
        {index === 1 && <Shield className="w-7 h-7 transition-colors duration-300 text-cream-300 dark:text-cream-400" />}
        {index === 2 && <Zap className="w-7 h-7 transition-colors duration-300 text-cream-300 dark:text-cream-400" />}
        {index === 3 && <Globe className="w-7 h-7 transition-colors duration-300 text-cream-300 dark:text-cream-400" />}
      </div>
      
      <div className="text-center relative z-10">
        <div className="text-5xl font-light mb-3 transition-all duration-500 text-cream-900 dark:text-cream-900 group-hover:text-cream-800 dark:group-hover:text-cream-800">
          {stat.number === "Coming Soon" || stat.number === "24/7" 
            ? stat.number 
            : `${count}${stat.number.includes('%') ? '%' : ''}`
          }
        </div>
        <div className="text-lg font-medium transition-all duration-500 text-cream-700 dark:text-cream-700 group-hover:text-cream-600 dark:group-hover:text-cream-600">
          {stat.label}
        </div>
      </div>
      
      {/* Elegant hover border effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg shadow-cream-300/20 dark:shadow-cream-400/30 ring-1 ring-cream-300/30 dark:ring-cream-400/40" />
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-cream-300 dark:from-cream-400 to-cream-400 dark:to-cream-500" />
    </motion.div>
  );
};

// Enhanced Testimonial Card
const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  return (
    <motion.div
      className="group relative p-8 rounded-2xl transition-all duration-700 hover:-translate-y-2 hover:rotate-1 cursor-pointer bg-white/40 dark:bg-cream-200/40 border border-cream-200/40 dark:border-cream-300/40 hover:bg-white/60 dark:hover:bg-cream-200/60 hover:border-cream-300/50 dark:hover:border-cream-400/50 backdrop-blur-sm hover:shadow-2xl"
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{ 
        scale: 1.05,
        rotate: 2,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      style={{
        animationDelay: `${index * 0.2}s`,
        transform: `rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`
      }}
    >
      {/* Quote decoration */}
      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center bg-cream-100 dark:bg-cream-200 group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl text-cream-300 dark:text-cream-400">"</span>
      </div>
      
      {/* Content */}
      <p className="leading-relaxed mb-6 italic transition-colors duration-300 text-cream-700 dark:text-cream-700 group-hover:text-cream-600 dark:group-hover:text-cream-600">
        "{testimonial.content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold transition-colors duration-300 text-cream-900 dark:text-cream-900 group-hover:text-cream-800 dark:group-hover:text-cream-800">
            {testimonial.name}
          </p>
          <p className="text-sm transition-colors duration-300 text-cream-500 dark:text-cream-500">
            {testimonial.handle}
          </p>
        </div>
        
        {/* Avatar */}
        <motion.div 
          className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
        >
          {testimonial.avatar}
        </motion.div>
      </div>
      
      {/* Gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${testimonial.gradient}`} />
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
    </motion.div>
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-cream-50 relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingElements />
      
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 bg-white/90 dark:bg-cream-100/90 backdrop-blur-sm border-b border-cream-200 dark:border-cream-200"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
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
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Features</a>
              <a href="#privacy" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Privacy</a>
              <a href="#community" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Community</a>
              <ThemeToggle />
              
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="cursor-pointer border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-100 dark:hover:bg-cream-200">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="cursor-pointer bg-cream-900 dark:bg-cream-300 text-cream-50 dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button 
                className="p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 text-cream-700 dark:text-cream-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-6 py-3 rounded-full border text-sm font-medium mb-8 transition-all duration-300 hover:scale-105 cursor-pointer bg-cream-100 dark:bg-cream-200 border-cream-200 dark:border-cream-300 text-cream-700 dark:text-cream-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Privacy-first social networking
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </motion.div>
            
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-7xl font-light text-cream-900 dark:text-cream-900 mb-6 leading-tight flex flex-wrap items-center justify-center">
                <span>Share your</span>
                <span className="font-special italic text-cream-300 dark:text-cream-300 flex items-center mx-4">
                  <AnimatedLock />
                  private
                </span>
                <span className="font-special italic text-cream-300 dark:text-cream-300 flex items-center mx-4">
                  moments
                  <ImageCarousel />
                </span>
                <span className="w-full text-center mt-4">with your loved ones</span>
              </h1>
            </motion.div>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-cream-700 dark:text-cream-700 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              A safe space for authentic connections. Share, connect, and build 
              meaningful relationships without compromising your privacy.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/signup">
                <Button size="lg" className="cursor-pointer bg-cream-900 dark:bg-cream-300 text-cream-50 dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 px-8 py-3 text-lg group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="cursor-pointer border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-100 dark:hover:bg-cream-200 px-8 py-3 text-lg">
                Learn More
              </Button>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative max-w-4xl mx-auto"
            >              <div className="bg-white dark:bg-cream-100 rounded-3xl p-12 shadow-minimalist-md border border-cream-200 dark:border-cream-300 transition-all duration-500 hover:scale-[1.02]">
                <div className="text-center">
                  <div className="w-60 h-60 mx-auto mb-6 relative overflow-hidden rounded-full shadow-lg hover:scale-110 transition-all duration-300">
                    <DiscoBallComponent className="w-full h-full" />
                  </div>
                  <h3 className="text-2xl font-semibold text-cream-900 dark:text-cream-900 mb-4">Your Circle Awaits</h3>
                  <p className="text-cream-700 dark:text-cream-700 text-lg leading-relaxed">
                    Join a community that values authentic connections and meaningful conversations. 
                    Share your moments with the people who matter most.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-cream-100 dark:bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-cream-900 dark:text-cream-900 mb-6">
              Built for <span className="font-special italic">authentic</span> connections
            </h2>
            <p className="text-xl text-cream-700 dark:text-cream-700 max-w-3xl mx-auto leading-relaxed">
              Experience social networking that prioritizes your privacy, 
              meaningful relationships, and genuine conversations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "End-to-end encryption ensures your conversations stay private. Your data belongs to you.",
                span: ""
              },
              {
                icon: Users,
                title: "Real Connections",
                description: "Quality over quantity. Connect with people who share your interests and values.",
                span: ""
              },
              {
                icon: MessageCircle,
                title: "Meaningful Conversations",
                description: "Tools designed to foster deep discussions and authentic sharing beyond surface interactions.",
                span: ""
              },
              {
                icon: Heart,
                title: "Trusted Circle",
                description: "Share your moments with a curated group of close friends and family in a safe environment.",
                span: ""
              },
              {
                icon: Lock,
                title: "Mental Well-being",
                description: "Features designed to promote positive interactions and reduce social media anxiety.",
                span: ""
              },
              {
                icon: Star,
                title: "Authentic Sharing",
                description: "Encourage genuine moments and real stories without the pressure of likes or validation.",
                span: ""
              }
            ].map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">            {[
              { number: "Coming Soon", label: "" },
              { number: "100%", label: "Privacy Focused" },
              { number: "24/7", label: "Support Ready" },
              { number: "0%", label: "Data Tracking" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-3"
              >                <div className="text-4xl md:text-5xl font-light text-cream-900 dark:text-cream-900">{stat.number}</div>
                <div className="text-cream-700 dark:text-cream-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* Testimonials */}
      <section id="community" className="py-20 px-6 bg-cream-100 dark:bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-cream-900 dark:text-cream-900 mb-6">
              Loved by our <span className="font-special italic">community</span>
            </h2>
            <p className="text-xl text-cream-700 dark:text-cream-700">
              See what people are saying about SocialFlow
            </p>
          </motion.div>          {/* Organic flowing layout */}
          <div className="relative max-w-5xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                handle: "@sarahc",
                content: "Finally, a platform where I can share my real moments with people who matter, without worrying about privacy.",
                avatar: "SC",
                gradient: "from-pink-400 to-rose-500",
                position: "top-0 left-0"
              },
              {
                name: "Marcus Johnson",
                handle: "@mjohnson", 
                content: "The intimacy of sharing with just my close circle has brought back the joy of social media for me.",
                avatar: "MJ",
                gradient: "from-blue-400 to-indigo-500",
                position: "top-12 right-0"
              },
              {
                name: "Elena Rodriguez",
                handle: "@elena_r",
                content: "Love how SocialFlow protects my family moments while keeping us connected with loved ones.",
                avatar: "ER", 
                gradient: "from-emerald-400 to-teal-500",
                position: "top-64 left-1/2 transform -translate-x-1/2"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className={`absolute ${testimonial.position} w-80 group`}
                style={{
                  transform: index === 1 ? 'rotate(3deg)' : index === 2 ? 'rotate(-2deg)' : 'rotate(1deg)'
                }}
              >
                {/* Floating testimonial bubble */}
                <div className="relative">
                  {/* Main content bubble */}
                  <div className="bg-white/90 dark:bg-cream-200/90 backdrop-blur-sm rounded-[2rem] p-6 shadow-lg border border-cream-200/50 dark:border-cream-300/50 group-hover:shadow-xl transition-all duration-300">
                    {/* Quote content */}
                    <p className="text-cream-700 dark:text-cream-700 leading-relaxed mb-4 font-light text-lg italic">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-cream-900 dark:text-cream-900">
                          {testimonial.name}
                        </p>
                        <p className="text-cream-500 dark:text-cream-500 text-sm">
                          {testimonial.handle}
                        </p>
                      </div>
                      
                      {/* Floating avatar */}
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                        whileHover={{ 
                          scale: 1.1,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-[2rem] opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
                </div>
              </motion.div>
            ))}
              {/* Spacer for absolute positioning */}
            <div className="h-96 md:h-[30rem]" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}            className="bg-cream-100 dark:bg-cream-200 rounded-3xl p-12 border border-cream-200 dark:border-cream-300"
          >
            <h2 className="text-4xl md:text-5xl font-light text-cream-900 dark:text-cream-900 mb-6">
              Ready to join <span className="font-special italic">SocialFlow</span>?
            </h2>
            <p className="text-xl text-cream-700 dark:text-cream-700 mb-10 leading-relaxed">
              Start sharing your private moments in a safe, meaningful environment 
              designed for authentic connections.
            </p>            
              <div className="flex flex-col sm:flex-row gap-4 justify-center">              
                <Link href="/signup">
                <Button size="lg" className="cursor-pointer bg-cream-900 dark:bg-cream-300 text-cream-50 dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 px-8 py-3 text-lg">
                  Sign Up Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="cursor-pointer border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-50 dark:hover:bg-cream-200 px-8 py-3 text-lg">
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>      {/* Footer */}
      <footer className="py-16 px-6 border-t border-cream-200 dark:border-cream-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-32 h-32 relative">
                <Image
                  src="/logo.png"
                  alt="SocialFlow Logo"
                  width={400}
                  height={200}
                  className="h-32 dark:hidden"
                />
                <Image
                  src="/logo-dark.png"
                  alt="Social Sphere"
                  width={200}
                  height={100}
                  className="h-32 w-auto hidden dark:block"
                  priority
                />
              </div>
            </div>
            <div className="flex space-x-8 text-cream-700 dark:text-cream-700">
              <a href="#" className="hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Privacy</a>
              <a href="#" className="hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Terms</a>
              <a href="#" className="hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Support</a>
              <a href="#" className="hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">About</a>
            </div>
          </div>
          <div className="text-center mt-12 text-cream-500 dark:text-cream-500">
            <p className="font-light">© {new Date().getFullYear()} SocialFlow. Crafted with care for meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
