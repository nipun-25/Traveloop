"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Bookmark, ArrowRight } from 'lucide-react';
import { login, signup } from './(auth)/actions';

const DESTINATIONS = [
  {
    id: 0,
    name: 'Thailand',
    desc: 'Thailand is a Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins and ornate temples. In Bangkok, the capital, an ultramodern cityscape rises next to quiet canalside communities.',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80',
    location: 'Southeast Asia'
  },
  {
    id: 1,
    name: 'Switzerland',
    desc: 'Experience the pristine majesty of the Swiss Alps. From the crystal-clear waters of Lake Brienz to the snow-capped peaks of the Eiger, Switzerland offers a serene escape into nature\'s most breathtaking landscapes.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1600&q=80',
    location: 'Central Europe'
  },
  {
    id: 2,
    name: 'Indonesia',
    desc: 'Indonesia is a Southeast Asian nation made up of thousands of volcanic islands. It is home to the world\'s largest Muslim population and Bali\'s beautiful terraced rice paddies, pristine beaches and religious temples.',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&q=80',
    location: 'Southeast Asia'
  },
  {
    id: 3,
    name: 'Japan',
    desc: 'Japan is an island nation in the Pacific Ocean with dense cities, imperial palaces, mountainous national parks and thousands of shrines and temples. Shinkansen bullet trains connect the main islands.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80',
    location: 'East Asia'
  },
];

interface LandingPageProps {
  initialAuthType?: 'login' | 'signup' | null;
}

export default function LandingPage({ initialAuthType = null }: LandingPageProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [authType, setAuthType] = useState<'login' | 'signup' | null>(initialAuthType);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % DESTINATIONS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      setSignupSuccess(true);
      setIsLoading(false);
    }
  }

  // Get the next 3 destinations for the card stack
  const getNextDestinations = () => {
    const nextIndices = [
      (current + 1) % DESTINATIONS.length,
      (current + 2) % DESTINATIONS.length,
      (current + 3) % DESTINATIONS.length,
    ];
    return nextIndices.map(idx => DESTINATIONS[idx]);
  };

  const visibleCards = getNextDestinations();

  return (
    <div className="hero">
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.25 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5, ease: 'easeInOut' },
            scale: { duration: 10, ease: 'linear' }
          }}
          className="slide-bg"
          style={{ backgroundImage: `url(${DESTINATIONS[current].image})` }}
        />
      </AnimatePresence>

      <div className="overlay" />

      {/* Navigation */}
      <nav>
        <div className="nav-links">
          <a href="#">News</a>
          <a href="#">Destinations</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>
        <div className="nav-right">
          <button className="search-btn glass">
            <Search size={18} />
          </button>
          <button
            className="login-nav-btn glass"
            onClick={() => {
              setAuthType(authType ? null : 'login');
              setError(null);
              setSignupSuccess(false);
            }}
          >
            {authType ? 'Explore' : 'Login'}
          </button>
          <div className="greeting">
            Hello, <span>Anney!</span>
          </div>
        </div>
      </nav>

      {/* Side Indicator */}
      <div className="side-dots">
        {DESTINATIONS.map((_, idx) => (
          <div
            key={idx}
            className={`side-dot ${current === idx ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="content"
          >
            <motion.h1
              initial={{ letterSpacing: '0.2em', opacity: 0 }}
              animate={{ letterSpacing: '0.02em', opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="dest-name"
            >
              {DESTINATIONS[current].name}
            </motion.h1>
            <p className="dest-desc">{DESTINATIONS[current].desc}</p>
            <button className="explore-btn" onClick={() => setAuthType('signup')}>
              Explore
              <span className="arrow-circle">
                <ArrowRight size={16} />
              </span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Card Stack / Login Form Container */}
      <div className="right-panel">
        <AnimatePresence mode="wait">
          {!authType ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="cards-stack"
            >
              {visibleCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: idx === 2 ? 0.6 : 1, x: 0 }}
                  className={`dest-card card-${idx === 0 ? 'main' : idx === 1 ? 'side' : 'peek'}`}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img src={card.image} alt={card.name} />
                  <div className="card-overlay">
                    <button className="bookmark-btn glass">
                      <Bookmark size={14} fill={idx === 0 ? "currentColor" : "none"} />
                    </button>
                    <div className="card-info">
                      <div className="card-title">{card.name}</div>
                      <div className="card-dots">
                        <div className={`cdot ${idx === 0 ? 'on' : ''}`} />
                        <div className="cdot" />
                        <div className="cdot" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={signupSuccess ? 'success' : authType}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", damping: 25 }}
              className="login-container glass"
            >
              {signupSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                  <p className="text-sm text-white/60 mb-8">We've sent a confirmation link to your email address.</p>
                  <button
                    onClick={() => {
                      setSignupSuccess(false);
                      setAuthType('login');
                    }}
                    className="login-submit-btn w-full"
                  >
                    Back to Login
                  </button>
                </div>
              ) : authType === 'login' ? (
                <>
                  <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Login to your account to continue your journey.</p>
                  </div>
                  <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" name="email" placeholder="Enter your email" required className="glass" />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input type="password" name="password" placeholder="••••••••" required className="glass" />
                    </div>
                    <div className="form-options">
                      <label><input type="checkbox" /> Remember me</label>
                      <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                    </div>
                    {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                    <button type="submit" disabled={isLoading} className="login-submit-btn">
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                  <div className="login-footer">
                    <p>Don't have an account? <button onClick={() => { setAuthType('signup'); setError(null); }}>Create one</button></p>
                  </div>
                </>
              ) : (
                <>
                  <div className="login-header">
                    <h2>Create Account</h2>
                    <p>Join Traveloop and start planning your next adventure.</p>
                  </div>
                  <form className="login-form" onSubmit={handleSignup}>
                    <div className="input-group">
                      <label>Full Name</label>
                      <input type="text" name="name" placeholder="John Doe" required className="glass" />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" name="email" placeholder="you@example.com" required className="glass" />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input type="password" name="password" placeholder="••••••••" required className="glass" />
                    </div>
                    <div className="input-group">
                      <label>Confirm Password</label>
                      <input type="password" name="confirmPassword" placeholder="••••••••" required className="glass" />
                    </div>
                    {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                    <button type="submit" disabled={isLoading} className="login-submit-btn">
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </form>
                  <div className="login-footer">
                    <p>Already have an account? <button onClick={() => { setAuthType('login'); setError(null); }}>Log in</button></p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="nav-controls">
          <div className="nav-arrows">
            <button className="nav-arrow glass" onClick={prevSlide}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-arrow glass" onClick={nextSlide}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
