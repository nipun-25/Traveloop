"use client";

import React, { useState } from 'react';
import { updateProfile } from './actions';
import { User, Mail, Globe, Camera, Save, MapPin } from 'lucide-react';
import type { Profile } from '@/types';

const S = {
  page: { maxWidth: 700, margin: "0 auto" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 32 },
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "28px", marginBottom: 20 },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 },
  avatarSection: { display: "flex", alignItems: "center", gap: 20, marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #c5d4c5, #8cb89e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#2d4a35", flexShrink: 0 },
  fieldGroup: { marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none", fontFamily: "'Montserrat', sans-serif" },
  select: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  saveBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 0", borderRadius: 9999, background: "#2d4a35", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  success: { background: "#dce8dc", border: "1px solid #8cb89e", color: "#2d4a35", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500, marginBottom: 20 },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500, marginBottom: 20 },
};

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
    <div style={S.page}>
      <h1 style={S.title}>Profile & Settings</h1>
      <p style={S.subtitle}>Manage your account and preferences.</p>

      {message && <div style={message.type === "success" ? S.success : S.error}>{message.text}</div>}

      <div style={S.card}>
        <div style={S.sectionLabel}><User size={13} /> Personal Information</div>
        <div style={S.avatarSection}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{name || "Unnamed"}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{profile.email}</div>
          </div>
        </div>
        <div style={S.row}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Full Name</label>
            <input style={S.input} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Email Address</label>
            <input style={S.input} value={profile.email} disabled />
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionLabel}><Globe size={13} /> Preferences</div>
        <div style={S.fieldGroup}>
          <label style={S.label}>Language</label>
          <select style={S.select} value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>

      <button style={{ ...S.saveBtn, opacity: loading ? 0.7 : 1 }} onClick={handleSave} disabled={loading}>
        <Save size={16} /> {loading ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
