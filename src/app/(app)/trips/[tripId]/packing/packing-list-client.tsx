"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Plus, Trash2, Shirt, FileText, Smartphone, Briefcase, Package, ChevronDown } from 'lucide-react';
import { addPackingItem, togglePackingItem, removePackingItem } from './actions';
import type { PackingItem } from '@/types';

const CATEGORIES = [
  { name: "Clothing", icon: <Shirt size={16} />, color: "var(--primary)" },
  { name: "Documents", icon: <FileText size={16} />, color: "var(--gold)" },
  { name: "Electronics", icon: <Smartphone size={16} />, color: "var(--accent-light)" },
  { name: "Toiletries", icon: <Package size={16} />, color: "#10b981" },
  { name: "Medicine", icon: <Briefcase size={16} />, color: "#ef4444" },
  { name: "Other", icon: <Briefcase size={16} />, color: "var(--text-muted)" },
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
    <div style={{ display: "flex", flexDirection: "column", gap: 32, fontFamily: "'Montserrat', sans-serif" }}>
      <header>
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
        <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>Packing Checklist</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Keep track of everything you need for your journey.</p>
      </header>

      {/* Progress Bar */}
      <div className="glass-panel" style={{ padding: "24px 32px", borderRadius: 24, display: "flex", alignItems: "center", gap: 24, border: '1px solid var(--outline-variant)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>{packedCount} of {items.length} items</div>
        <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ 
            height: "100%", 
            width: `${pct}%`, 
            background: pct === 100 ? "#10b981" : "linear-gradient(90deg, var(--primary), var(--accent-light))", 
            borderRadius: 10, 
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)" 
          }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: pct === 100 ? "#10b981" : "var(--primary)", minWidth: 50, textAlign: "right" }}>{pct}%</div>
      </div>

      {/* Add Item Form */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <input 
          style={{ 
            flex: "1 1 300px", 
            padding: "16px 20px", 
            borderRadius: 16, 
            border: "1px solid var(--outline-variant)", 
            background: "rgba(255,255,255,0.03)", 
            fontSize: 15, 
            color: "white", 
            outline: "none",
            fontWeight: 500,
            transition: 'all 0.3s'
          }} 
          placeholder="What do you need to pack?" 
          value={newItem} 
          onChange={e => setNewItem(e.target.value)} 
          onKeyDown={e => e.key === "Enter" && handleAdd()} 
          onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--outline-variant)'}
        />
        <div style={{ position: 'relative', flex: "0 0 200px" }}>
          <select 
            style={{ 
              width: "100%",
              padding: "16px 20px", 
              borderRadius: 16, 
              border: "1px solid var(--outline-variant)", 
              background: "rgba(255,255,255,0.03)", 
              fontSize: 15, 
              color: "white", 
              outline: "none",
              fontWeight: 600,
              appearance: 'none',
              cursor: 'pointer'
            }} 
            value={newCat} 
            onChange={e => setNewCat(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
          <ChevronDown size={18} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        </div>
        <button 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 10, 
            background: "var(--primary)", 
            color: "white", 
            border: "none", 
            borderRadius: 16, 
            padding: "16px 32px", 
            fontSize: 15, 
            fontWeight: 800, 
            cursor: "pointer",
            transition: 'all 0.3s',
            boxShadow: '0 8px 24px rgba(26, 111, 205, 0.2)'
          }} 
          onClick={handleAdd}
        >
          <Plus size={20} /> Add
        </button>
      </div>

      {items.length === 0 && (
        <div className="glass-panel" style={{ padding: 64, borderRadius: 32, textAlign: "center", border: "1px dashed var(--outline-variant)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 16, fontWeight: 500 }}>
            Your packing list is empty. Add your first item above!
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
        {groupedByCategory.map((cat) => (
          <div key={cat.name} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px" }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                background: cat.color + "20", 
                color: cat.color, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: `1px solid ${cat.color}40`
              }}>
                {cat.icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: '-0.01em' }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto", fontWeight: 700 }}>
                {cat.items.filter(i => i.is_packed).length} / {cat.items.length}
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cat.items.map((item) => (
                <div key={item.id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 16, 
                  padding: "16px 20px", 
                  borderRadius: 20, 
                  background: item.is_packed ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", 
                  border: item.is_packed ? "1px solid transparent" : "1px solid var(--outline-variant)", 
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: item.is_packed ? 0.6 : 1
                }}>
                  <div 
                    onClick={() => handleToggle(item)} 
                    style={{ 
                      width: 26, 
                      height: 26, 
                      borderRadius: 8, 
                      border: item.is_packed ? "none" : "2px solid var(--outline)", 
                      background: item.is_packed ? "#10b981" : "transparent", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      cursor: "pointer", 
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.is_packed && <Check size={16} color="#fff" strokeWidth={3} />}
                  </div>
                  <div style={{ 
                    fontSize: 15, 
                    color: "white", 
                    textDecoration: item.is_packed ? "line-through" : "none", 
                    flex: 1,
                    fontWeight: item.is_packed ? 500 : 600,
                    transition: 'all 0.3s'
                  }}>
                    {item.item_name}
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    style={{ 
                      border: "none", 
                      background: "none", 
                      color: "rgba(255,255,255,0.2)", 
                      cursor: "pointer", 
                      padding: 8,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
