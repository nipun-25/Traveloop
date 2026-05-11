"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { saveNotes } from './actions';

export default function NotesEditorClient({ tripId, initialContent }: { tripId: string; initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    const result = await saveNotes(tripId, content);
    setLoading(false);
    if (result.success) setSaved(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, fontFamily: "'Montserrat', sans-serif" }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <Link href={`/trips/${tripId}`} style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            color: "var(--text-muted)", 
            fontSize: 13, 
            fontWeight: 700, 
            textDecoration: "none", 
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <ArrowLeft size={16} /> Back to Trip
          </Link>
          <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>Trip Notes & Journal</h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Jot down important details, reminders, and memories.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading} 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 10, 
            background: "var(--primary)", 
            color: "white", 
            border: "none", 
            borderRadius: 16, 
            padding: "14px 28px", 
            fontSize: 14, 
            fontWeight: 800, 
            cursor: loading ? "not-allowed" : "pointer", 
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 8px 24px rgba(26, 111, 205, 0.2)',
            transition: 'all 0.3s'
          }}
        >
          {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
          {loading ? "Saving…" : "Save Notes"}
        </button>
      </header>

      {saved && (
        <div className="glass-panel" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", borderRadius: 16, padding: "16px 24px", fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={20} /> Notes saved successfully!
        </div>
      )}

      <div className="glass-panel" style={{ padding: 40, borderRadius: 32, border: '1px solid var(--outline-variant)' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <FileText size={16} /> Your Journal
        </div>
        <textarea
          value={content}
          onChange={e => { setContent(e.target.value); setSaved(false); }}
          placeholder="Write your travel notes, reminders, hotel check-in info, local contacts, etc…"
          style={{ 
            width: "100%", 
            minHeight: 500, 
            padding: "24px", 
            borderRadius: 20, 
            border: "1px solid var(--outline-variant)", 
            background: "rgba(255,255,255,0.02)", 
            fontSize: 16, 
            color: "white", 
            outline: "none", 
            resize: "vertical", 
            fontFamily: "'Montserrat', sans-serif", 
            lineHeight: 1.8,
            fontWeight: 500,
            transition: 'all 0.3s'
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--outline-variant)'}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
