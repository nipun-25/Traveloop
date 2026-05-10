"use client";

import { useState } from "react";
import { signup } from "../actions";
import Link from "next/link";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      setSuccess(true);
      setIsLoading(false);
    }
  }

  const glassStyle = {
    backdropFilter: 'blur(30px)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '32px',
    padding: '54px',
    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.5)'
  };

  if (success) {
    return (
      <div className="animate-fade-in text-center" style={glassStyle}>
        <div className="w-20 h-20 bg-green-500/15 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">Check Your Email</h2>
        <p className="text-white/50 text-sm mb-10 leading-relaxed font-medium">
          We've sent a confirmation link to your email address. Please click the link to activate your account.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="w-full bg-white/10 py-4.5 rounded-2xl font-bold text-white tracking-[0.2em] uppercase text-xs border border-white/20 hover:bg-white/20 transition-all"
        >
          Back to Signup
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative overflow-hidden" style={glassStyle}>
      <div className="login-header">
        <h2 className="text-4xl font-bold text-white mb-3">Create Account</h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-[260px]">Join Traveloop and start planning your next adventure.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form mt-10">
        <div className="input-group mb-5">
          <label className="text-xs font-semibold text-white/70 mb-2.5 block ml-1">Full Name</label>
          <input 
            type="text" 
            name="name"
            placeholder="John Doe" 
            required
            className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1a6fcd] focus:bg-black/30 transition-all" 
          />
        </div>
        <div className="input-group mb-5">
          <label className="text-xs font-semibold text-white/70 mb-2.5 block ml-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            placeholder="you@example.com" 
            required
            className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1a6fcd] focus:bg-black/30 transition-all" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="input-group">
            <label className="text-xs font-semibold text-white/70 mb-2.5 block ml-1">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              required
              className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1a6fcd] focus:bg-black/30 transition-all" 
            />
          </div>
          <div className="input-group">
            <label className="text-xs font-semibold text-white/70 mb-2.5 block ml-1">Confirm</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••" 
              required
              className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1a6fcd] focus:bg-black/30 transition-all" 
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold mb-8 flex items-center gap-2">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#1a6fcd] py-5 rounded-2xl font-bold text-white tracking-widest uppercase text-xs shadow-lg hover:bg-[#2577d6] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="login-footer mt-10 text-center text-xs">
        <p className="text-white/50 font-medium">
          Already have an account? <Link href="/login" className="text-white font-bold underline underline-offset-8 decoration-white/20 hover:decoration-white transition-all ml-2">Log in</Link>
        </p>
      </div>
    </div>
  );
}
