"use client";

import { useState } from "react";
import { login } from "../actions";
import Link from "next/link";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div 
      className="animate-fade-in relative overflow-hidden"
      style={{
        backdropFilter: 'blur(30px)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '32px',
        padding: '54px',
        boxShadow: '0 40px 120px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div className="login-header">
        <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-[240px]">
          Login to your account to continue your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form mt-12">
        <div className="input-group mb-8">
          <label className="text-xs font-semibold text-white/70 mb-3 block ml-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            placeholder="Enter your email" 
            required
            className="w-full bg-black/20 border border-white/10 px-6 py-4.5 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1a6fcd] focus:bg-black/30 transition-all" 
          />
        </div>
        <div className="input-group mb-8">
          <label className="text-xs font-semibold text-white/70 mb-3 block ml-1">Password</label>
          <input 
            type="password" 
            name="password"
            placeholder="••••••••" 
            required
            className="w-full bg-black/20 border border-white/10 px-6 py-4.5 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1a6fcd] focus:bg-black/30 transition-all" 
          />
        </div>
        
        <div className="form-options flex justify-between items-center text-xs mb-12">
          <label className="flex items-center gap-3 cursor-pointer text-white/60 hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 checked:bg-[#1a6fcd]" /> 
            Remember me
          </label>
          <Link href="/forgot-password" title="Reset your password" className="text-[#1a6fcd] hover:text-white font-bold transition-colors">
            Forgot Password?
          </Link>
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
          {isLoading ? 'Sign In...' : 'Sign In'}
        </button>
      </form>

      <div className="login-footer mt-12 text-center text-xs">
        <p className="text-white/50 font-medium">
          Don't have an account? <Link href="/signup" className="text-white font-bold underline underline-offset-8 decoration-white/20 hover:decoration-white transition-all ml-2">Create one</Link>
        </p>
      </div>
    </div>
  );
}
