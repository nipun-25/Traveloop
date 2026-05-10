"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './_components/logout-button';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "flight", label: "My Trips", href: "/trips" },
  { icon: "person", label: "Profile", href: "/profile" },
  { icon: "bar_chart", label: "Analytics", href: "/admin" },
];

const S = {
  // Layout
  root: { 
    display: "flex", 
    minHeight: "100vh", 
    background: "#f0ede8", 
    fontFamily: "'Montserrat', sans-serif", 
    color: "#1a1a1a" 
  },
  // Sidebar
  sidebar: { 
    width: 240, 
    minWidth: 240, 
    background: "#f5f3ef", 
    borderRight: "1px solid #e2ddd6", 
    display: "flex", 
    flexDirection: "column" as const, 
    padding: "28px 16px", 
    position: "sticky" as const, 
    top: 0, 
    height: "100vh" 
  },
  logo: { 
    fontFamily: "'Playfair Display', serif", 
    fontSize: 22, 
    fontWeight: 700, 
    color: "#1a1a1a", 
    lineHeight: 1.15, 
    marginBottom: 4 
  },
  logoSub: { 
    fontSize: 11, 
    color: "#888", 
    letterSpacing: "0.05em", 
    marginBottom: 24 
  },
  planBtn: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 6, 
    background: "#2d4a35", 
    color: "#fff", 
    border: "none", 
    borderRadius: 9999, 
    padding: "10px 0", 
    fontSize: 12, 
    fontWeight: 700, 
    cursor: "pointer", 
    letterSpacing: "0.04em", 
    marginBottom: 28, 
    width: "100%",
    textDecoration: 'none'
  },
  navItem: (active: boolean) => ({
    display: "flex", 
    alignItems: "center", 
    gap: 10, 
    padding: "9px 12px", 
    borderRadius: 10,
    background: active ? "#dce8dc" : "transparent",
    color: active ? "#2d4a35" : "#666",
    fontSize: 13, 
    fontWeight: active ? 700 : 500, 
    cursor: "pointer", 
    border: "none", 
    width: "100%", 
    textAlign: "left" as const,
    marginBottom: 2,
    textDecoration: 'none'
  }),
  navIcon: { fontSize: 18 },
  profileRow: { 
    display: "flex", 
    alignItems: "center", 
    gap: 10, 
    marginTop: "auto", 
    paddingTop: 20,
    borderTop: "1px solid #e2ddd6"
  },
  avatar: { 
    width: 34, 
    height: 34, 
    borderRadius: "50%", 
    background: "#c5d4c5", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 12, 
    fontWeight: 700, 
    color: "#2d4a35", 
    flexShrink: 0 
  },
  // Main
  main: { 
    flex: 1, 
    padding: "36px 40px 60px", 
    overflowY: "auto" as const 
  }
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === "admin@traveloop.com");
    }
    checkAdmin();
  }, [supabase]);

  const filteredNav = NAV.filter(item => {
    if (item.href === "/admin") return isAdmin;
    return true;
  });

  return (
    <div style={S.root}>
      {/* Google Fonts & Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        .nav-btn:hover { background: #ede9e3 !important; }
        .plan-btn:hover { background: #3a5e44 !important; }
        
        /* Premium thin scrollbar */
        main {
          scroll-behavior: smooth;
        }
        main::-webkit-scrollbar {
          width: 6px;
        }
        main::-webkit-scrollbar-track {
          background: transparent;
        }
        main::-webkit-scrollbar-thumb {
          background: #d8d4ce;
          border-radius: 9999px;
        }
        main::-webkit-scrollbar-thumb:hover {
          background: #c0bab2;
        }
        /* Firefox */
        main {
          scrollbar-width: thin;
          scrollbar-color: #d8d4ce transparent;
        }
      `}</style>

      {/* SIDEBAR */}
      <nav style={S.sidebar}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={S.logo}>Traveloop</div>
          <div style={S.logoSub}>Bespoke Travel</div>
        </Link>

        <Link href="/trips/create-trip" className="plan-btn" style={S.planBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>add</span>
          Plan New Trip
        </Link>

        <div style={{ flex: 1 }}>
          {filteredNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-btn"
              style={S.navItem(pathname === item.href)}
            >
              <span className="material-symbols-outlined" style={{ ...S.navIcon, fontVariationSettings: pathname === item.href ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={S.profileRow}>
          <div style={S.avatar}>User</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>Traveler</div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={S.main}>
        {children}
      </main>
    </div>
  );
}
