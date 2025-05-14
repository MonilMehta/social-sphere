'use client';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowRight, Users, MessageCircle, Shield, Heart, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
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
    <div className="relative inline-block w-16 h-16 ml-3 align-middle">
      <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-cream-300 dark:border-cream-300 shadow-lg">
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
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
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
      className="inline-block ml-2 mr-2 align-middle"
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
      <Lock className="w-8 h-8 text-cream-300 dark:text-cream-300" />
    </motion.div>
  );
};

export default function Home() {return (
    <div className="min-h-screen bg-cream-50 dark:bg-cream-50">
        <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 bg-white/90 dark:bg-cream-100/90 backdrop-blur-sm border-b border-cream-200 dark:border-cream-200"
       >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="SocialFlow Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="font-special text-xl text-cream-900 dark:text-cream-900">
                SocialFlow
              </span>
            </div><div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Features</a>
              <a href="#privacy" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Privacy</a>
              <a href="#community" className="text-cream-700 dark:text-cream-700 hover:text-cream-900 dark:hover:text-cream-900 transition-colors font-medium">Community</a>
              <ThemeToggle />              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-100 dark:hover:bg-cream-200">
                  Login
                </Button>
                <Button size="sm" className="bg-cream-900 dark:bg-cream-300 text-white dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-cream-100 dark:bg-cream-200 border border-cream-200 dark:border-cream-300 text-sm font-medium text-cream-700 dark:text-cream-700 mb-8"
            >
              <Lock className="w-4 h-4 mr-2" />
              Privacy-first social networking
            </motion.div>
            
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >              <h1 className="text-5xl md:text-7xl font-light text-cream-900 dark:text-cream-900 mb-6 leading-tight">
                Share your{' '}
                <span className="font-special italic text-cream-300 dark:text-cream-300 inline-flex items-center">
                  <AnimatedLock />
                  private
                </span>
                {' '}
                <span className="font-special italic text-cream-300 dark:text-cream-300 inline-flex items-center">
                  moments
                  <ImageCarousel />
                </span>
                <br />
                with your loved ones
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
            >              <Button size="lg" className="bg-cream-900 dark:bg-cream-300 text-white dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 px-8 py-3 text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-100 dark:hover:bg-cream-200 px-8 py-3 text-lg">
                Learn More
              </Button>
            </motion.div>            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative max-w-4xl mx-auto"
            >              <div className="bg-white dark:bg-cream-100 rounded-3xl p-12 shadow-minimalist-md border border-cream-200 dark:border-cream-300">
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "End-to-end encryption ensures your conversations stay private. Your data belongs to you, not advertisers."
              },
              {
                icon: Users,
                title: "Real Connections",
                description: "Quality over quantity. Connect with people who share your interests and values, not just follower counts."
              },
              {
                icon: MessageCircle,
                title: "Meaningful Conversations",
                description: "Tools designed to foster deep discussions and authentic sharing, moving beyond surface-level interactions."
              },
              {
                icon: Heart,
                title: "Trusted Circle",
                description: "Share your moments with a curated group of close friends and family in a safe, private environment."
              },
              {
                icon: Lock,
                title: "Mental Well-being",
                description: "Features designed to promote positive interactions and reduce social media anxiety and comparison."
              },
              {
                icon: Star,
                title: "Authentic Sharing",
                description: "Encourage genuine moments and real stories without the pressure of likes or public validation."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}                viewport={{ once: true }}
                className="bg-white dark:bg-cream-200 rounded-3xl p-8 shadow-minimalist border border-cream-200 dark:border-cream-300 hover:shadow-minimalist-md transition-all duration-300"
              >
                <div className="w-14 h-14 bg-cream-100 dark:bg-cream-300 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-cream-300 dark:text-cream-900" />
                </div>
                <h3 className="text-xl font-semibold text-cream-900 dark:text-cream-900 mb-3">{feature.title}</h3>
                <p className="text-cream-700 dark:text-cream-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Trusted Users" },
              { number: "1M+", label: "Private Moments" },
              { number: "50+", label: "Countries" },
              { number: "99.9%", label: "Uptime" }
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
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                handle: "@sarahc",
                content: "Finally, a platform where I can share my real moments with people who matter, without worrying about privacy.",
                avatar: "SC"
              },
              {
                name: "Marcus Johnson",
                handle: "@mjohnson",
                content: "The intimacy of sharing with just my close circle has brought back the joy of social media for me.",
                avatar: "MJ"
              },
              {
                name: "Elena Rodriguez",
                handle: "@elena_r",
                content: "Love how SocialFlow protects my family moments while keeping us connected with loved ones.",
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}                viewport={{ once: true }}
                className="bg-white dark:bg-cream-200 rounded-3xl p-8 shadow-minimalist border border-cream-200 dark:border-cream-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cream-300 dark:bg-cream-300 rounded-full flex items-center justify-center text-white dark:text-cream-900 font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-cream-900 dark:text-cream-900">{testimonial.name}</p>
                    <p className="text-cream-700 dark:text-cream-700">{testimonial.handle}</p>
                  </div>
                </div>
                <p className="text-cream-700 dark:text-cream-700 leading-relaxed">{testimonial.content}</p>
              </motion.div>
            ))}
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
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-cream-900 dark:bg-cream-300 text-white dark:text-cream-900 hover:bg-cream-900/90 dark:hover:bg-cream-300/90 px-8 py-3 text-lg">
                Sign Up Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-cream-300 dark:border-cream-300 text-cream-700 dark:text-cream-700 hover:bg-cream-50 dark:hover:bg-cream-200 px-8 py-3 text-lg">
                Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>      {/* Footer */}
      <footer className="py-16 px-6 border-t border-cream-200 dark:border-cream-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="SocialFlow Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="font-special text-xl text-cream-900 dark:text-cream-900">
                SocialFlow
              </span>
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
