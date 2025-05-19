'use client';
import Head from 'next/head';
import Spline from '@splinetool/react-spline/next';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Social Sphere - Modern, Secure, Private, You.</title>
        <meta name="description" content="Join Social Sphere, the new standard for social networking." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>
      <main className="flex flex-col items-center justify-start min-h-screen bg-beige-50 text-brown-700 p-4 overflow-x-hidden">
        {/* Combined Hero Section: Spline + Text in a row */}
        <section className="w-full flex flex-col md:flex-row items-center justify-around my-8 md:my-12 gap-8 px-4 md:px-8 hero-section-combined">
          {/* Spline Animation Container */}
          <div className="w-full md:w-2/5 lg:w-1/2 h-[50vh] md:h-[60vh] flex items-center justify-center spline-container-visual">
            <Spline scene="https://prod.spline.design/gWGqtDBFlrUsmUe8/scene.splinecode" className="w-full h-full rounded-lg shadow-xl" />
          </div>

          {/* Hero Text Content Container */}
          <div className="w-full md:w-3/5 lg:w-1/2 text-center md:text-left flex flex-col items-center md:items-start justify-center hero-text-content">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-caveat font-bold text-brown-800 mb-6 animate-fadeInUp">
              Social Sphere
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-brown-600 mb-10 animate-fadeInUp animation-delay-300 font-inter">
              Modern, Secure, Private, <span className="text-teal-600 font-semibold">You.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8">
              <button className="bg-teal-500 hover:bg-teal-600 text-white font-inter font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transform transition-transform duration-300 hover:scale-105 animate-fadeInUp animation-delay-600 w-full sm:w-auto">
                Sign Up
              </button>
              <button className="bg-transparent hover:bg-teal-100 text-teal-600 font-inter font-semibold py-3 px-8 rounded-lg text-lg shadow-md border border-teal-500 transform transition-transform duration-300 hover:scale-105 animate-fadeInUp animation-delay-700 w-full sm:w-auto">
                Login
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 w-full max-w-5xl features-section">
          <h2 className="text-4xl md:text-5xl font-caveat font-bold text-brown-800 text-center mb-12 md:mb-16 animate-fadeInUp animation-delay-900">
            Why Social Sphere?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-inter">
            {/* Feature 1: Modern */}
            <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-teal-500/20 animate-fadeInUp animation-delay-1200">
              <div className="text-teal-500 mb-4 text-3xl"> ✨ </div>
              <h3 className="text-2xl font-semibold text-brown-700 mb-3">Modern</h3>
              <p className="text-brown-600">
                Experience a sleek, intuitive interface designed for today's social interactions.
              </p>
            </div>

            {/* Feature 2: Secure */}
            <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-teal-500/20 animate-fadeInUp animation-delay-1400">
              <div className="text-teal-500 mb-4 text-3xl"> 🛡️ </div>
              <h3 className="text-2xl font-semibold text-brown-700 mb-3">Secure</h3>
              <p className="text-brown-600">
                Your data is protected with end-to-end encryption and robust security measures.
              </p>
            </div>

            {/* Feature 3: Private */}
            <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-teal-500/20 animate-fadeInUp animation-delay-1600">
              <div className="text-teal-500 mb-4 text-3xl"> 🔒 </div>
              <h3 className="text-2xl font-semibold text-brown-700 mb-3">Private</h3>
              <p className="text-brown-600">
                Control your privacy with granular settings. What you share is up to you.
              </p>
            </div>

            {/* Feature 4: You */}
            <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-teal-500/20 animate-fadeInUp animation-delay-1800">
              <div className="text-teal-500 mb-4 text-3xl"> 👤 </div>
              <h3 className="text-2xl font-semibold text-brown-700 mb-3">You</h3>
              <p className="text-brown-600">
                A platform built around your needs, fostering genuine connections.
              </p>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section Placeholder */}
        <section className="py-16 md:py-24 w-full max-w-5xl testimonials-section">
          <h2 className="text-4xl md:text-5xl font-caveat font-bold text-brown-800 text-center mb-12 md:mb-16 animate-fadeInUp animation-delay-900">
            Loved by Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-inter">
            {/* Testimonial 1 */}
            <div className="bg-white bg-opacity-70 p-8 rounded-xl shadow-xl animate-fadeInUp animation-delay-1200">
              <p className="text-brown-600 italic mb-4">
                "Social Sphere has changed how I connect online. It's so refreshing to have a platform that prioritizes privacy and genuine interaction!"
              </p>
              <p className="text-brown-700 font-semibold">- Alex P.</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white bg-opacity-70 p-8 rounded-xl shadow-xl animate-fadeInUp animation-delay-1400">
              <p className="text-brown-600 italic mb-4">
                "Finally, a social media app that feels modern and secure. The design is beautiful and it's incredibly easy to use."
              </p>
              <p className="text-brown-700 font-semibold">- Jamie L.</p>
            </div>
          </div>
        </section>

        <footer className="text-center py-10 mt-16 border-t border-brown-200 w-full max-w-5xl animate-fadeInUp animation-delay-2100 font-inter">
          <p className="text-brown-500">&copy; {new Date().getFullYear()} Social Sphere. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
