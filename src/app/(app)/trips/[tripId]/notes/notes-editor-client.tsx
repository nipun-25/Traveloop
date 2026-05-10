"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, StickyNote } from 'lucide-react';
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
    <div>
      <Link href={`/trips/${tripId}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28 }}>
        <ArrowLeft size={15} /> Back to Trip
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Trip Notes & Journal</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Jot down important details, reminders, and memories.</p>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", border: "none", borderRadius: 9999, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          <Save size={16} /> {loading ? "Saving…" : "Save"}
        </button>
      </div>

      {saved && (
        <div style={{ background: "#dce8dc", border: "1px solid #8cb89e", color: "#2d4a35", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
          Notes saved successfully!
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <StickyNote size={13} /> Your Notes
        </div>
        <textarea
          value={content}
          onChange={e => { setContent(e.target.value); setSaved(false); }}
          placeholder="Write your travel notes, reminders, hotel check-in info, local contacts, etc…"
          style={{ width: "100%", minHeight: 400, padding: "16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none", resize: "vertical", fontFamily: "'Montserrat', sans-serif", lineHeight: 1.8 }}
        />
      </div>
    </div>
  );
}
