"use client"

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";

const HomePage = () => {

    const Router = useRouter();

    const [loading, setLoading] = useState(false);

  const handleOnSignIn = () => {
    setLoading(true);
    Router.push("/sign-in");
  };

  const handleOnGetStarted = () => {
    setLoading(true);
    Router.push("/sign-up");
  };

  useEffect(() => {
    // Smooth scroll for internal anchor links
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) =>
      anchor.addEventListener("click", handleAnchorClick)
    );

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => observer.observe(el));

    return () => {
      anchors.forEach((anchor) =>
        anchor.removeEventListener("click", handleAnchorClick)
      );
      setLoading(false);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    
    <main className="bg-gray-900 text-white overflow-x-hidden font-outfit">
      {/* Add the full JSX content here from the HTML body, converted line-by-line */}

      {/* Example for the nav header */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">🎓</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SchooLama AI
              </span>
            </div>
            <div className="hidden md:flex space-x-8 sm:pr-4">
              <a
                href="#features"
                className="hover:text-purple-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-purple-400 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#future"
                className="hover:text-purple-400 transition-colors"
              >
                Roadmap
              </a>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all" onClick={handleOnSignIn}>
                Sign In
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all glow-effect" onClick={handleOnGetStarted}>
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Insert the rest of the sections (Hero, Features, Pricing, Future, CTA, Footer) */}
      <section className="relative min-h-screen flex items-center justify-center gradient-bg">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="floating-animation inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl">
                🚀
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Learning with{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                AI Power
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Create intelligent courses, generate quizzes instantly, and engage
              students with AI-powered flashcards. The future of education is
              here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-lg font-semibold hover:scale-105 transition-transform pulse-glow" onClick={handleOnGetStarted}>
                Start Free Trial - 5 Credits
              </button>
              <button className="px-8 py-4 border-2 border-white/30 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Setup in 2 Minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Animated background elements --> */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* <!-- Features Section --> */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Modern Learning
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Leverage cutting-edge AI technology to create, manage, and deliver
              exceptional learning experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <!-- Smart Notes Generation --> */}
            <div className="feature-card rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Notes Generation</h3>
              <p className="text-gray-400 mb-4">
                AI-powered note creation that transforms any content into
                structured, comprehensive study materials instantly.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Automatic content summarization</li>
                <li>• Key concept extraction</li>
                <li>• Personalized learning paths</li>
              </ul>
            </div>

            {/* <!-- Intelligent Quizzes --> */}
            <div className="feature-card rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Intelligent Quizzes</h3>
              <p className="text-gray-400 mb-4">
                Generate adaptive quizzes that adjust difficulty based on
                student performance and learning progress.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Multiple question types</li>
                <li>• Instant feedback system</li>
                <li>• Performance analytics</li>
              </ul>
            </div>

            {/* <!-- Dynamic Flashcards --> */}
            <div className="feature-card rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🗂️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Dynamic Flashcards</h3>
              <p className="text-gray-400 mb-4">
                Create interactive flashcards with spaced repetition algorithms
                for optimal memory retention.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Spaced repetition system</li>
                <li>• Visual learning support</li>
                <li>• Progress tracking</li>
              </ul>
            </div>

            {/* <!-- AI Chatbot --> */}
            <div className="feature-card rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Jedi</h3>
              <p className="text-gray-400 mb-4">
                24/7 intelligent tutoring assistant powered by Groq API for
                instant help and explanations.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Instant question answering</li>
                <li>• Concept explanations</li>
                <li>• Study recommendations</li>
              </ul>
            </div>

            {/* <!-- Credit System --> */}
            <div className="feature-card rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Flexible Credit System</h3>
              <p className="text-gray-400 mb-4">
                Pay-as-you-go model with 5 free credits to get started. One
                credit equals one complete course.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 5 free credits for new users</li>
                <li>• Transparent pricing</li>
                <li>• No subscription locks</li>
              </ul>
            </div>

            {/* <!-- Responsive Design --> */}
            <div className="feature-card rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Multi-Device Support</h3>
              <p className="text-gray-400 mb-4">
                Seamless experience across all devices - desktop, tablet, and
                mobile with responsive design.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Mobile-first design</li>
                <li>• Offline capabilities</li>
                <li>• Cross-platform sync</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Pricing Section --> */}
      <section id="pricing" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprise
              charges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* <!-- Free Plan --> */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Free Starter</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-gray-400 mb-6">Perfect for trying out</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>5 Free Credits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>Basic AI Features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>Community Support</span>
                  </li>
                </ul>
                <button className="w-full py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* <!-- Standard Plan --> */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 transform scale-105 glow-effect">
              <div className="text-center">
                <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-4">Standard</h3>
                <div className="text-4xl font-bold mb-2">$2</div>
                <p className="text-gray-200 mb-6">Per credit</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                      ✓
                    </span>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                      ✓
                    </span>
                    <span>Advanced AI Models</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                      ✓
                    </span>
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                      ✓
                    </span>
                    <span>Analytics Dashboard</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                  Choose Standard
                </button>
              </div>
            </div>

            {/* <!-- Enterprise Plan --> */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <div className="text-4xl font-bold mb-2">Custom</div>
                <p className="text-gray-400 mb-6">For large organizations</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>Everything in Standard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>Bulk Credits Discount</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>Custom Integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>Dedicated Support</span>
                  </li>
                </ul>
                <button className="w-full py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Future Features --> */}
      <section id="future" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Coming Soon...{" "}    
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Next-Gen Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're constantly innovating to bring you the future of online
              education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <!-- Video Lectures --> */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500 transition-all scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Video Lectures Platform</h3>
              <p className="text-gray-400 mb-4">
                Full-featured video hosting like Udemy, allowing instructors to
                upload, manage, and monetize their courses.
              </p>
              <div className="inline-block bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                Coming Q3 2025
              </div>
            </div>

            {/* <!-- Certificates --> */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Digital Certificates</h3>
              <p className="text-gray-400 mb-4">
                Blockchain-verified certificates awarded upon course completion,
                with LinkedIn integration and employer verification.
              </p>
              <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                Coming Q4 2025
              </div>
            </div>

            {/* <!-- AI Recommendations --> */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all scroll-reveal">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Recommendations</h3>
              <p className="text-gray-400 mb-4">
                AI-powered course recommendations based on learning history,
                goals, and industry trends.
              </p>
              <div className="inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                Coming Q1 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- CTA Section --> */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Join thousands of educators and students who are already using
              SchooLama AI to revolutionize education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Footer --> */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎓</span>
                </div>
                <span className="text-xl font-bold">SchooLama AI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing education with AI-powered learning management
                systems.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SchooLama AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
    
  );
};

export default HomePage;
