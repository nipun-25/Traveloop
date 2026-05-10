"use client";

import React, { useState, useRef } from 'react';
import { createTrip } from '../actions';
import { Calendar, MapPin, Upload, ArrowLeft, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

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

    // Attach cover photo file if selected
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
      // redirect throws, which is expected on success
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 16px' }}>
      <Link href="/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: '#888', fontSize: 13, fontWeight: 500,
        textDecoration: 'none', marginBottom: 28
      }}>
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>

      <h1 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 5vw, 28px)',
        fontWeight: 700, color: '#1a1a1a', marginBottom: 6
      }}>Plan a New Adventure</h1>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 36 }}>
        Craft the details of your next extraordinary journey.
      </p>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
          borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 500, marginBottom: 20
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Trip Details */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #e8e4de',
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)', marginBottom: 24
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 8
          }}><MapPin size={13} /> Trip Details</div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
              Trip Name
            </label>
            <input
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1px solid #e2ddd6', background: '#faf9f7', fontSize: 14,
                color: '#1a1a1a', outline: 'none', fontFamily: "'Montserrat', sans-serif",
                boxSizing: 'border-box'
              }}
              name="name" placeholder="e.g. Summer in the Amalfi Coast" required
            />
          </div>

          <div style={{ marginBottom: 0 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
              Description
            </label>
            <textarea
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1px solid #e2ddd6', background: '#faf9f7', fontSize: 14,
                color: '#1a1a1a', outline: 'none', minHeight: 100, resize: 'vertical' as const,
                fontFamily: "'Montserrat', sans-serif", boxSizing: 'border-box'
              }}
              name="description" placeholder="Describe your dream trip…"
            />
          </div>
        </div>

        {/* Travel Dates */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #e8e4de',
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)', marginBottom: 24
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 8
          }}><Calendar size={13} /> Travel Dates</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                Start Date
              </label>
              <input
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1px solid #e2ddd6', background: '#faf9f7', fontSize: 14,
                  color: '#1a1a1a', outline: 'none', fontFamily: "'Montserrat', sans-serif",
                  boxSizing: 'border-box'
                }}
                type="date" name="start_date" required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                End Date
              </label>
              <input
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1px solid #e2ddd6', background: '#faf9f7', fontSize: 14,
                  color: '#1a1a1a', outline: 'none', fontFamily: "'Montserrat', sans-serif",
                  boxSizing: 'border-box'
                }}
                type="date" name="end_date" required
              />
            </div>
          </div>
        </div>

        {/* Cover Photo Upload */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #e8e4de',
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)', marginBottom: 24
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 8
          }}><ImageIcon size={13} /> Cover Photo (Optional)</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="cover-upload"
          />

          {coverPreview ? (
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
              <img
                src={coverPreview}
                alt="Cover preview"
                style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', borderRadius: 16 }}
              />
              <button
                type="button"
                onClick={removeCover}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
              <div style={{
                position: 'absolute', bottom: 12, left: 12,
                background: 'rgba(0,0,0,0.5)', color: '#fff',
                padding: '4px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                backdropFilter: 'blur(4px)'
              }}>
                {coverFile?.name}
              </div>
            </div>
          ) : (
            <label
              htmlFor="cover-upload"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed #ddd8d0', borderRadius: 16,
                padding: 'clamp(24px, 5vw, 40px) 24px',
                textAlign: 'center', color: '#aaa', cursor: 'pointer',
                background: '#fdfcfb', transition: 'border-color 0.2s'
              }}
            >
              <Upload size={28} style={{ marginBottom: 10, color: '#ccc' }} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>Drag & drop or click to upload</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>PNG, JPG, WebP up to 5MB</div>
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px 0', borderRadius: 9999,
            background: '#2d4a35', color: '#fff', border: 'none',
            fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.02em', opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s, transform 0.2s',
            marginBottom: 40
          }}
        >
          <Sparkles size={16} />
          {loading ? "Creating Trip…" : "Create Trip"}
        </button>
      </form>
    </div>
  );
}
