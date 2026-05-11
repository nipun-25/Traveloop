"use client";

import React, { useState } from 'react';
import { updateProfile } from './actions';
import type { Profile } from '@/types';
import { 
  User, 
  Mail, 
  Languages, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

export default function ProfileFormClient({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.name || "");
  const [lang, setLang] = useState(profile.language_preference || "en");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSave() {
    setLoading(true);
    setMessage(null);
    const fd = new FormData();
    fd.set("name", name);
    const result = await updateProfile(fd);
    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update" });
    }
    setLoading(false);
  }

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", display: 'flex', flexDirection: 'column', gap: 40, fontFamily: "'Montserrat', sans-serif" }}>
      <header>
        <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>Profile & Settings</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Manage your account and travel preferences.</p>
      </header>

      {message && (
        <div style={{
          padding: '16px 24px',
          borderRadius: 16,
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 180, 171, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 180, 171, 0.3)'}`,
          color: message.type === 'success' ? '#10b981' : '#ffb4ab',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="glass-panel" style={{ padding: 32, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 32, border: '1px solid var(--outline-variant)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 24,
            background: 'var(--primary-container)',
            color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800,
            border: '1px solid rgba(26, 111, 205, 0.2)'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 6, letterSpacing: '-0.01em' }}>{name || "Explorer"}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={14} opacity={0.6} /> {profile.email}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
              <input
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--outline-variant)",
                  borderRadius: 16,
                  padding: "16px 20px 16px 48px",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 500,
                  outline: "none",
                  transition: 'all 0.3s'
                }}
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--outline-variant)'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.3 }} />
              <input
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid var(--outline-variant)",
                  borderRadius: 16,
                  padding: "16px 20px 16px 48px",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 15,
                  fontWeight: 500,
                  outline: "none"
                }}
                value={profile.email}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 32, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--outline-variant)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Languages size={20} color="var(--accent-light)" />
          Travel Preferences
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Language</label>
          <div style={{ position: 'relative' }}>
            <select
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
                appearance: 'none',
                cursor: 'pointer'
              }}
              value={lang}
              onChange={e => setLang(e.target.value)}
            >
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      <button
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
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={22} />}
        {loading ? "Updating Profile..." : "Save Profile Changes"}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
