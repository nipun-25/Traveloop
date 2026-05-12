"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, CheckCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'success' | 'alert';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Welcome to Traveloop!',
    message: 'Start planning your dream adventure today. Explore destinations and create your first trip.',
    date: '2026-05-12',
    type: 'success'
  },
  {
    id: '2',
    title: 'New Feature: Glass Calendar',
    message: 'We\'ve added a beautiful new glass-morphism calendar for better trip planning.',
    date: '2026-05-11',
    type: 'info'
  },
  {
    id: '3',
    title: 'Upcoming Adventure',
    message: 'Your trip to Switzerland is just a few weeks away. Don\'t forget to check your itinerary!',
    date: '2026-05-10',
    type: 'alert'
  }
];

export default function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const saved = localStorage.getItem('traveloop_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
      localStorage.setItem('traveloop_notifications', JSON.stringify(MOCK_NOTIFICATIONS));
    }
  }, []);

  const markAsSeen = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('traveloop_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('traveloop_notifications', JSON.stringify([]));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 3000,
            }}
          />

          {/* Center Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              width: '100%',
              maxWidth: 400,
              height: 'calc(100vh - 40px)',
              background: 'rgba(10, 15, 30, 0.8)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 32,
              zIndex: 3001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: 'rgba(26, 111, 205, 0.15)', color: 'var(--primary)',
                  display: 'grid', placeItems: 'center'
                }}>
                  <Bell size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>Notifications</h2>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {notifications.length} Unread
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', padding: 8 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Notifications List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="custom-scrollbar">
              {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {notifications.map((n) => (
                    <motion.div
                      layout
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => markAsSeen(n.id)}
                      style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 20,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      whileHover={{ background: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)', x: -4 }}
                    >
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ 
                          flexShrink: 0, width: 32, height: 32, borderRadius: 10, 
                          background: n.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 
                                      n.type === 'alert' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          display: 'grid', placeItems: 'center'
                        }}>
                          {n.type === 'success' ? <CheckCircle size={16} color="#22c55e" /> : 
                           n.type === 'alert' ? <Clock size={16} color="#f59e0b" /> : <Info size={16} color="#3b82f6" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>{n.title}</h4>
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255, 255, 255, 0.3)' }}>{n.date}</span>
                          </div>
                          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5, margin: 0 }}>
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: 0.5 }}>
                  <Bell size={48} strokeWidth={1} />
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>There is no notification</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button 
                  onClick={clearAll}
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: 16, 
                    background: 'rgba(255, 255, 255, 0.05)', color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
