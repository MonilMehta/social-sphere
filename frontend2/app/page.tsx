'use client';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowRight, Users, MessageCircle, Shield, Heart, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import './globals.css';

// Image Carousel Component
const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative inline-block w-24 h-24 ml-4 align-middle">
      <div className="absolute inset-0 rounded-full overflow-hidden border-3 border-cream-300 dark:border-cream-300 shadow-lg">
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

// Animated Lock Component
const AnimatedLock = () => {
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
      <Lock className="w-12 h-12 text-cream-300 dark:text-cream-300" />
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-cream-50">
        <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 bg-white/90 dark:bg-cream-100/90 backdrop-blur-sm border-b border-cream-200 dark:border-cream-200"
       >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">            <div className="flex items-center space-x-3">
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
            </div><div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Features</a>
              <a href="#privacy" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Privacy</a>
              <a href="#community" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Community</a>
              <ThemeToggle />              <div className="flex items-center space-x-3">
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
          </div>
        </div>
      </motion.nav>      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-cream-100 dark:bg-cream-200 border border-cream-200 dark:border-cream-300 text-sm font-medium text-cream-700 dark:text-cream-700 mb-8 hover:bg-cream-200 dark:hover:bg-cream-300 transition-colors cursor-default"
            >
              <Lock className="w-4 h-4 mr-2" />
              Privacy-first social networking
            </motion.div>
            
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >              <h1 className="text-5xl md:text-7xl font-light text-cream-900 dark:text-cream-900 mb-6 leading-tight flex flex-wrap items-center justify-center">
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
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"            >              <Button size="lg" className="cursor-pointer bg-cream-900 dark:bg-cream-300 text-cream-50 dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 px-8 py-3 text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="cursor-pointer border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-100 dark:hover:bg-cream-200 px-8 py-3 text-lg">
                Learn More
              </Button>
            </motion.div>            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative max-w-4xl mx-auto"
            >              <div className="bg-white dark:bg-cream-100 rounded-3xl p-12 shadow-lg border border-cream-200 dark:border-cream-300 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cream-300 dark:bg-cream-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white dark:text-cream-900" />
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
      <section id="features" className="py-24 px-6 bg-cream-100 dark:bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light text-cream-900 dark:text-cream-900 mb-6">
              Built for <span className="font-special italic">authentic</span> connections
            </h2>
            <p className="text-xl text-cream-700 dark:text-cream-700 max-w-3xl mx-auto leading-relaxed">
              Experience social networking that prioritizes your privacy, 
              meaningful relationships, and genuine conversations.
            </p>
          </motion.div><div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[180px]">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "End-to-end encryption ensures your conversations stay private.",
                span: "col-span-1 md:col-span-2 lg:col-span-2"
              },
              {
                icon: Users,
                title: "Real Connections",
                description: "Quality over quantity. Connect with people who matter.",
                span: "col-span-1 md:col-span-2 lg:col-span-2"
              },
              {
                icon: MessageCircle,
                title: "Meaningful Conversations",
                description: "Tools designed to foster deep discussions and authentic sharing.",
                span: "col-span-1 md:col-span-2 lg:col-span-2"
              },
              {
                icon: Heart,
                title: "Trusted Circle",
                description: "Share moments with curated friends in a safe environment.",
                span: "col-span-1 md:col-span-2 lg:col-span-3"
              },
              {
                icon: Lock,
                title: "Mental Well-being", 
                description: "Features promoting positive interactions and reducing anxiety.",
                span: "col-span-1 md:col-span-2 lg:col-span-2"
              },
              {
                icon: Star,
                title: "Authentic Sharing",
                description: "Genuine moments without pressure.",
                span: "col-span-1 md:col-span-2 lg:col-span-1"
              }            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1
                }}
                viewport={{ once: true }}
                className={`group bg-white dark:bg-cream-200 rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-cream-300 hover:shadow-md hover:border-cream-300 dark:hover:border-cream-400 transition-all duration-300 cursor-pointer ${feature.span}`}
              >                <motion.div 
                  className="w-10 h-10 bg-cream-900 dark:bg-cream-300 rounded-xl flex items-center justify-center mb-4 transition-all duration-200"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <feature.icon className="w-5 h-5 text-cream-50 dark:text-cream-900" />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-cream-900 dark:text-cream-900 mb-2 group-hover:text-cream-800 dark:group-hover:text-cream-800 transition-colors duration-200">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-cream-700 dark:text-cream-700 leading-relaxed group-hover:text-cream-600 dark:group-hover:text-cream-600 transition-colors duration-200">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* Stats Section */}
      <section className="py-24 px-6">
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
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-3 p-6 bg-white dark:bg-cream-200 rounded-2xl border border-cream-200 dark:border-cream-300 hover:shadow-md transition-all duration-300 cursor-default"
              >                <div className="text-3xl md:text-4xl font-light text-cream-900 dark:text-cream-900">{stat.number}</div>
                <div className="text-cream-700 dark:text-cream-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* Testimonials */}
      <section id="community" className="py-24 px-6 bg-cream-100 dark:bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
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
      </section>      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}            className="bg-cream-100 dark:bg-cream-200 rounded-3xl p-12 border border-cream-200 dark:border-cream-300 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-4xl md:text-5xl font-light text-cream-900 dark:text-cream-900 mb-6">
              Ready to join <span className="font-special italic">SocialFlow</span>?
            </h2>
            <p className="text-xl text-cream-700 dark:text-cream-700 mb-10 leading-relaxed">
              Start sharing your private moments in a safe, meaningful environment 
              designed for authentic connections.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.png"
                  alt="SocialFlow Logo"
                  width={100}
                  height={80}
                  className="rounded-lg"
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
