"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './_components/logout-button';
import NotificationCenter from './_components/notification-center';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  User,
  BarChart3,
  PlusCircle,
  HelpCircle,
  Search,
  Bell,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Explore", href: "/trips" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: BarChart3, label: "Analytics", href: "/admin" },
];

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80', // Mountains
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80', // Beach
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1080&q=80', // Nature
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1080&q=80', // Forest
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1080&q=80', // Lake
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [userName, setUserName] = useState('Traveler');
  const [userInitials, setUserInitials] = useState('T');
  const [searchVal, setSearchVal] = useState("");
   const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Background Cycling Logic - Matched to Landing Page (8s)
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Check for notifications for the unread dot
  useEffect(() => {
    const checkNotifications = () => {
      const saved = localStorage.getItem('traveloop_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHasNotifications(parsed.length > 0);
      } else {
        setHasNotifications(true); // Default mock has 3
      }
    };
    checkNotifications();
    // Refresh check when panel opens/closes
    const interval = setInterval(checkNotifications, 2000);
    return () => clearInterval(interval);
  }, [isNotificationsOpen]);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAdmin(user.email === "admin@traveloop.com");
        const rawName = user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler';
        const formatted = rawName
          .toLowerCase()
          .split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setUserName(formatted);
        const parts = formatted.split(' ');
        const initials = parts.length >= 2
          ? parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
          : parts[0].charAt(0);
        setUserInitials(initials.toUpperCase());
      }
    }
    checkUser();
  }, [supabase]);

  const filteredNav = NAV.filter(item => {
    if (item.href === "/admin") return isAdmin;
    return true;
  });

  const currentBg = BG_IMAGES[bgIndex];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "transparent", fontFamily: "'Montserrat', sans-serif", color: "white" }}>
      {/* Cinematic Background Layer */}
      <div className="app-bg-container">
        <AnimatePresence>
          <motion.img
            key={currentBg}
            src={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="app-bg-image"
            alt=""
            style={{ 
              filter: 'brightness(1.1)',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </AnimatePresence>
        <div className="app-bg-overlay" style={{ background: "radial-gradient(circle at center, rgba(5,10,25,0.05), rgba(5,10,25,0.25))" }} />
      </div>

      {/* Sidebar Trigger Area */}
      <div
        onMouseEnter={() => setIsSidebarExpanded(true)}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 20, zIndex: 60 }}
      />

      {/* Sidebar */}
      <motion.nav
        className="sidebar"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        initial={false}
        animate={{ width: isSidebarExpanded ? 280 : 88 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(5, 10, 25, 0.45)",
          backdropFilter: "blur(40px) saturate(180%)",
          display: "flex",
          flexDirection: "column",
          padding: "40px 18px", // Consistent base padding
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        {/* Identity Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 48,
          width: "100%",
          paddingLeft: 4 // Ensures logo centers well when collapsed
        }}>
          <div style={{
            width: 44,
            height: 44,
            background: "linear-gradient(135deg, var(--primary), var(--tertiary))",
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 18,
            color: "white",
            boxShadow: "0 8px 20px rgba(59, 143, 240, 0.3)",
            flexShrink: 0
          }}>
            {userInitials}
          </div>
          <AnimatePresence>
            {isSidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ display: "flex", flexDirection: "column", whiteSpace: "nowrap" }}
              >
                <span style={{ fontWeight: 700, fontSize: 17, color: "white", letterSpacing: "-0.02em" }}>{userName}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{isAdmin ? 'Administrator' : 'Elite Explorer'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredNav.map((item) => {
            const active = pathname === item.href;
            const NavIcon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-link ${active ? "active" : "inactive"}`}
                style={{
                  background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  backdropFilter: active ? 'blur(10px)' : 'none',
                  border: active ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  padding: "12px 14px",
                  justifyContent: isSidebarExpanded ? "flex-start" : "center",
                  borderRadius: 14,
                  gap: 12
                }}
              >
                <NavIcon size={20} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Plan New Trip */}
        <Link
          href="/trips/create-trip"
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            color: "white",
            padding: "16px 0",
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 15,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            cursor: "pointer",
            marginTop: 24,
            transition: "all 0.3s ease",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            textDecoration: 'none',
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            minHeight: 52
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <PlusCircle size={20} color="var(--tertiary)" />
          {isSidebarExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Plan New Trip</motion.span>}
        </Link>

        {/* Bottom Links */}
        <div style={{ paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          <div className="nav-link inactive" style={{ opacity: 0.7, justifyContent: isSidebarExpanded ? "flex-start" : "center", padding: "12px 14px" }}>
            <HelpCircle size={20} style={{ flexShrink: 0 }} />
            {isSidebarExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Help Center</motion.span>}
          </div>
          <div className="nav-link inactive" style={{ opacity: 0.7, justifyContent: isSidebarExpanded ? "flex-start" : "center", padding: "12px 14px" }}>
            <LogoutButton showLabel={isSidebarExpanded} />
          </div>
        </div>
      </motion.nav>


      {/* Main */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isMobile ? 0 : (isSidebarExpanded ? 280 : 88) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="main-content"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 10 }}
      >
        {/* Fragmented Top Bar */}
        <header className="app-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 60px",
          background: "transparent",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}>
          {/* Search Box */}
          <div style={{
            position: "relative",
            width: "40%",
            maxWidth: 440
          }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.5)",
                zIndex: 2
              }}
            />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 18,
                padding: "14px 20px 14px 54px",
                color: "white",
                fontFamily: "Montserrat",
                fontSize: 14,
                fontWeight: 500,
                outline: "none",
                transition: "all 0.3s",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                width: 44,
                height: 44,
                borderRadius: 14,
                color: "white",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "all 0.3s",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                <Bell size={20} />
                {hasNotifications && (
                  <span style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    background: '#ff4b4b',
                    borderRadius: '50%',
                    border: '2px solid #0a0f1e',
                    boxShadow: '0 0 10px rgba(255, 75, 75, 0.5)'
                  }} />
                )}
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: isMobile ? "24px 20px" : "48px 60px", flex: 1, width: "100%", boxSizing: "border-box" }}>
          {children}
        </div>
      </motion.main>

      {/* Mobile Bottom Navigation - Centered Plan Button and Equal Spacing */}
      <nav className="mobile-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: 'rgba(5, 10, 25, 0.45)',
        backdropFilter: 'blur(40px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'none',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '0',
        zIndex: 2000,
      }}>
        <Link href="/dashboard" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: pathname === "/dashboard" ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
          textDecoration: 'none', transition: 'all 0.3s'
        }}>
          <LayoutDashboard size={24} strokeWidth={pathname === "/dashboard" ? 2.5 : 2} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</span>
        </Link>
        <Link href="/trips" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: pathname === "/trips" ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
          textDecoration: 'none', transition: 'all 0.3s'
        }}>
          <Map size={24} strokeWidth={pathname === "/trips" ? 2.5 : 2} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore</span>
        </Link>
        <Link href="/trips/create-trip" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: pathname === "/trips/create-trip" ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
          textDecoration: 'none', transition: 'all 0.3s'
        }}>
          <PlusCircle size={24} strokeWidth={pathname === "/trips/create-trip" ? 2.5 : 2} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</span>
        </Link>
        <Link href="/profile" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: pathname === "/profile" ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
          textDecoration: 'none', transition: 'all 0.3s'
        }}>
          <User size={24} strokeWidth={pathname === "/profile" ? 2.5 : 2} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile</span>
        </Link>
        <button onClick={() => logout()} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'rgba(255, 255, 255, 0.6)',
          textDecoration: 'none', transition: 'all 0.3s',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0
        }}>
          <LogOut size={24} strokeWidth={2} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logout</span>
        </button>
      </nav>

      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  );
}

