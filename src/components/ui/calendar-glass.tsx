"use client";

import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassDatePickerProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (date: string) => void;
  label?: string;
}

export default function GlassDatePicker({ name, required, defaultValue, onChange, label }: GlassDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsOpen(false);
    if (onChange) {
      onChange(format(day, 'yyyy-MM-dd'));
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '0 8px' }}>
        <button type="button" onClick={prevMonth} style={{ color: 'white', padding: 8, borderRadius: 10, background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button type="button" onClick={nextMonth} style={{ color: 'white', padding: 8, borderRadius: 10, background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 12 }}>
        {days.map((day, i) => (
          <div key={i} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
            style={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: isSelected ? 'white' : isCurrentMonth ? 'white' : 'rgba(255,255,255,0.2)',
              background: isSelected ? 'var(--primary)' : 'transparent',
              transition: 'all 0.2s',
              margin: 2
            }}
            onMouseOver={(e) => {
              if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseOut={(e) => {
              if (!isSelected) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 16,
          padding: "16px 20px",
          color: selectedDate ? "white" : "rgba(255,255,255,0.4)",
          fontSize: 15,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--outline-variant)'}
      >
        <CalendarIcon size={18} color="var(--primary)" />
        {selectedDate ? format(selectedDate, 'PPP') : 'Select date...'}
      </div>
      
      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} 
        required={required}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              left: 0,
              width: 320,
              background: 'rgba(10, 18, 42, 0.9)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 24,
              padding: 20,
              zIndex: 1000,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              color: 'white'
            }}
          >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                type="button" 
                onClick={() => { setSelectedDate(null); setIsOpen(false); }}
                style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
              <button 
                type="button" 
                onClick={() => { onDateClick(new Date()); }}
                style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
