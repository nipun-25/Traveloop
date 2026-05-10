"use client";

import { useState, useEffect, useRef } from "react";
import { saveNotes } from "./actions";
import { Card } from "@/components/ui";

interface NotesEditorProps {
  tripId: string;
  initialContent: string;
}

export default function NotesEditor({ tripId, initialContent }: NotesEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic
  useEffect(() => {
    if (content === initialContent && !lastSaved) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setIsSaving(true);
      const result = await saveNotes(tripId, content);
      if (result.success) {
        setLastSaved(new Date());
      }
      setIsSaving(false);
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, tripId, initialContent, lastSaved]);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-foreground font-display">
          Trip Notes
        </h2>
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 animate-pulse">
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : null}
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-border focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts, links, or ideas for this trip..."
          className="w-full min-h-[500px] p-8 bg-surface text-foreground placeholder:text-neutral-400 focus:outline-none resize-none leading-relaxed text-base border-none"
        />
      </Card>

      <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-surface-muted/50 border border-border-muted">
        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Your notes are automatically saved as you type. Use this space for packing hacks, flight details, or destination wishlists.
        </p>
      </div>
    </div>
  );
}
