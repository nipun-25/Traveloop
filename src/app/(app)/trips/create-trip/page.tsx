"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTrip } from '../actions';
import { Calendar, MapPin, FileText, Upload, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

const S = {
  page: { maxWidth: 660, margin: "0 auto" },
  backLink: { display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28, cursor: "pointer" },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 },
  subheading: { fontSize: 14, color: "#888", marginBottom: 36 },
  card: { background: "#fff", borderRadius: 20, border: "1px solid #e8e4de", padding: "36px 32px", marginBottom: 24 },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 },
  fieldGroup: { marginBottom: 22 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none", fontFamily: "'Montserrat', sans-serif" },
  textarea: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none", minHeight: 100, resize: "vertical" as const, fontFamily: "'Montserrat', sans-serif" },
  dateRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  uploadArea: { border: "2px dashed #ddd8d0", borderRadius: 16, padding: "36px 24px", textAlign: "center" as const, color: "#aaa", cursor: "pointer", background: "#fdfcfb", transition: "border-color 0.2s" },
  uploadIcon: { marginBottom: 8, color: "#ccc" },
  uploadText: { fontSize: 13, fontWeight: 500 },
  uploadSub: { fontSize: 11, color: "#bbb", marginTop: 4 },
  submitBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 0", borderRadius: 9999, background: "#2d4a35", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500, marginBottom: 20 }
};

export default function NewTripPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
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
    <div style={S.page}>
      <Link href="/dashboard" style={S.backLink}>
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
      <h1 style={S.heading}>Plan a New Adventure</h1>
      <p style={S.subheading}>Craft the details of your next extraordinary journey.</p>

      {error && <div style={S.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={S.card}>
          <div style={S.sectionLabel}><MapPin size={13} /> Trip Details</div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Trip Name</label>
            <input style={S.input} name="name" placeholder="e.g. Summer in the Amalfi Coast" required />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} name="description" placeholder="Describe your dream trip…" />
          </div>
        </div>

        <div style={S.card}>
          <div style={S.sectionLabel}><Calendar size={13} /> Travel Dates</div>
          <div style={S.dateRow}>
            <div style={S.fieldGroup}>
              <label style={S.label}>Start Date</label>
              <input style={S.input} type="date" name="start_date" required />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>End Date</label>
              <input style={S.input} type="date" name="end_date" required />
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.sectionLabel}><Upload size={13} /> Cover Photo (Optional)</div>
          <div style={S.uploadArea}>
            <Upload size={28} style={S.uploadIcon} />
            <div style={S.uploadText}>Drag & drop or click to upload</div>
            <div style={S.uploadSub}>PNG, JPG up to 5MB</div>
          </div>
        </div>

        <button type="submit" style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          <Sparkles size={16} />
          {loading ? "Creating Trip…" : "Create Trip"}
        </button>
      </form>
    </div>
  );
}
