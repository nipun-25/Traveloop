"use client";

import React, { useState, useRef } from 'react';
import GlassDatePicker from '@/components/ui/calendar-glass';
import { createTrip } from '../actions';
import Link from 'next/link';
import { 
  ArrowLeft, 
  PlusCircle, 
  Calendar, 
  Image as ImageIcon, 
  UploadCloud, 
  X, 
  Rocket,
  Edit3,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function NewTripPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Only image files are allowed");
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setError(null);
  }

  function removeCover() {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (coverFile) {
      formData.set('cover_photo', coverFile);
    }

    try {
      const result = await createTrip(formData);
      if (result && !result.success) {
        setError(result.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      // redirect throws
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40, fontFamily: "'Montserrat', sans-serif" }}>
      <Link href="/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--text-muted)', fontSize: 13, fontWeight: 700,
        textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em'
      }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <header>
        <h1 style={{ fontSize: 32, color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>Plan a New Adventure</h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 500 }}>Craft the details of your next extraordinary journey.</p>
      </header>

      {error && (
        <div style={{
          padding: '16px 24px',
          borderRadius: 16,
          background: 'rgba(255, 180, 171, 0.1)',
          border: '1px solid rgba(255, 180, 171, 0.3)',
          color: '#ffb4ab',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div className="glass-panel" style={{ padding: 32, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Edit3 size={20} color="var(--primary)" />
            Trip Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trip Name</label>
            <input
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 16,
                padding: "16px 20px",
                color: "white",
                fontSize: 15,
                fontWeight: 500,
                outline: "none",
                transition: 'all 0.3s'
              }}
              name="name"
              placeholder="e.g. Summer in Tokyo"
              required
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--outline-variant)"}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</label>
            <textarea
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 16,
                padding: "16px 20px",
                color: "white",
                fontSize: 15,
                fontWeight: 500,
                outline: "none",
                minHeight: 140,
                resize: 'vertical',
                transition: 'all 0.3s'
              }}
              name="description"
              placeholder="What makes this journey special?"
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--outline-variant)"}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 32, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Calendar size={20} color="var(--accent-light)" />
            Travel Dates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Start Date</label>
              <GlassDatePicker name="start_date" required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>End Date</label>
              <GlassDatePicker name="end_date" required />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 32, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <ImageIcon size={20} color="var(--gold)" />
            Cover Photo
          </h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="cover-upload"
          />

          {coverPreview ? (
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 280, border: '1px solid var(--outline-variant)' }}>
              <img src={coverPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
              <button
                type="button"
                onClick={removeCover}
                style={{
                  position: 'absolute', top: 20, right: 20,
                  width: 44, height: 44, borderRadius: 14,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="cover-upload"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: "64px 32px", border: '2px dashed var(--outline-variant)', borderRadius: 24,
                cursor: 'pointer', background: 'rgba(255,255,255,0.01)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--outline-variant)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
              }}
            >
              <UploadCloud size={48} color="var(--primary)" opacity={0.4} style={{ marginBottom: 20 }} />
              <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Upload Cover Image</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8, fontWeight: 500 }}>Drag and drop or click to browse (Max 5MB)</span>
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "20px",
            background: "var(--primary)",
            color: "white",
            borderRadius: 20,
            fontWeight: 800,
            fontSize: 18,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 10px 30px rgba(26, 111, 205, 0.2)'
          }}
        >
          {loading ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <Rocket size={22} />}
          {loading ? "Creating your journey..." : "Launch This Trip"}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

