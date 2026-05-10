"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Plus, Trash2, RotateCcw, Shirt, FileText, Smartphone, Briefcase, Package } from 'lucide-react';
import { addPackingItem, togglePackingItem, removePackingItem } from './actions';
import type { PackingItem } from '@/types';

const CATEGORIES = [
  { name: "Clothing", icon: <Shirt size={15} />, color: "#5b8a68" },
  { name: "Documents", icon: <FileText size={15} />, color: "#d97706" },
  { name: "Electronics", icon: <Smartphone size={15} />, color: "#5b4db5" },
  { name: "Toiletries", icon: <Package size={15} />, color: "#e56040" },
  { name: "Medicine", icon: <Briefcase size={15} />, color: "#c44" },
  { name: "Other", icon: <Briefcase size={15} />, color: "#888" },
];

export default function PackingListClient({ tripId, initialItems }: { tripId: string; initialItems: PackingItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState("");
  const [newCat, setNewCat] = useState("Other");

  async function handleAdd() {
    if (!newItem.trim()) return;
    const fd = new FormData();
    fd.set("item_name", newItem);
    fd.set("category", newCat);
    const result = await addPackingItem(tripId, fd);
    if (result.success) {
      setItems([...items, { id: Date.now().toString(), trip_id: tripId, item_name: newItem, category: newCat, is_packed: false, created_at: "", updated_at: "", deleted_at: null }]);
      setNewItem("");
    }
  }

  async function handleToggle(item: PackingItem) {
    setItems(items.map(i => i.id === item.id ? { ...i, is_packed: !i.is_packed } : i));
    await togglePackingItem(tripId, item.id, !item.is_packed);
  }

  async function handleRemove(id: string) {
    setItems(items.filter(i => i.id !== id));
    await removePackingItem(tripId, id);
  }

  const packedCount = items.filter(i => i.is_packed).length;
  const pct = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const groupedByCategory = CATEGORIES.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.name)
  })).filter(cat => cat.items.length > 0);

  return (
    <div>
      <Link href={`/trips/${tripId}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28 }}>
        <ArrowLeft size={15} /> Back to Trip
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Packing Checklist</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Keep track of everything you need.</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>{packedCount} of {items.length} packed</div>
        <div style={{ flex: 1, height: 8, background: "#ede9e3", borderRadius: 9999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#2d4a35" : "#5b8a68", borderRadius: 9999, transition: "width 0.4s" }} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2d4a35", minWidth: 44, textAlign: "right" }}>{pct}%</div>
      </div>

      {/* Add Item */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <input style={{ flex: 1, padding: "10px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 13, color: "#1a1a1a", outline: "none" }} placeholder="Add a new item…" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
        <select style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 13, color: "#1a1a1a", outline: "none" }} value={newCat} onChange={e => setNewCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
        </select>
        <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", border: "none", borderRadius: 9999, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }} onClick={handleAdd}><Plus size={16} /> Add</button>
      </div>

      {items.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "2px dashed #ddd8d0", padding: "40px", textAlign: "center", color: "#888", fontSize: 14 }}>
          No packing items yet. Add items above to get started!
        </div>
      )}

      {groupedByCategory.map((cat) => (
        <div key={cat.name} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: cat.color + "18", color: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{cat.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{cat.name}</div>
            <div style={{ fontSize: 11, color: "#999", marginLeft: "auto" }}>{cat.items.filter(i => i.is_packed).length}/{cat.items.length}</div>
          </div>
          {cat.items.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "#fff", border: "1px solid #f0ede8", marginBottom: 6 }}>
              <div onClick={() => handleToggle(item)} style={{ width: 22, height: 22, borderRadius: 7, border: item.is_packed ? "none" : "2px solid #d8d4ce", background: item.is_packed ? "#2d4a35" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                {item.is_packed && <Check size={14} color="#fff" />}
              </div>
              <div style={{ fontSize: 14, color: item.is_packed ? "#aaa" : "#1a1a1a", textDecoration: item.is_packed ? "line-through" : "none", flex: 1 }}>{item.item_name}</div>
              <button onClick={() => handleRemove(item.id)} style={{ border: "none", background: "none", color: "#ccc", cursor: "pointer", padding: 4 }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
