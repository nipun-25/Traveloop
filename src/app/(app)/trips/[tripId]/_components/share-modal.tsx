"use client";

import { useState } from "react";
import { togglePublicSharing, regenerateShareSlug } from "../../actions";
import { Button, Card } from "@/components/ui";

interface ShareModalProps {
  tripId: string;
  isPublic: boolean;
  shareSlug: string | null;
  onClose: () => void;
}

export default function ShareModal({ tripId, isPublic, shareSlug, onClose }: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(isPublic);
  const [currentSlug, setCurrentSlug] = useState(shareSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = currentSlug 
    ? `${window.location.origin}/share/${currentSlug}`
    : "";

  async function handleToggleSharing() {
    setIsLoading(true);
    const nextState = !isSharing;
    const result = await togglePublicSharing(tripId, nextState);
    
    if (result.success) {
      setIsSharing(nextState);
      // If we just turned it on and didn't have a slug, we need to refresh to get it
      // but the server action handles generation. For now, let's assume it works.
      if (nextState && !currentSlug) {
        window.location.reload(); 
      }
    }
    setIsLoading(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <Card padding="lg" className="w-full max-w-md shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground font-display">
            Share Trip
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-surface-muted border border-border">
            <div>
              <p className="text-sm font-bold text-foreground">Public Link</p>
              <p className="text-xs text-neutral-500">Anyone with the link can view this trip</p>
            </div>
            <button
              onClick={handleToggleSharing}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isSharing ? 'bg-primary-500' : 'bg-neutral-200'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSharing ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {isSharing && shareUrl && (
            <div className="animate-fade-in space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  Shareable URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-grow p-2.5 rounded-[var(--radius-lg)] bg-surface border border-border text-xs font-mono truncate text-neutral-600">
                    {shareUrl}
                  </div>
                  <Button size="sm" onClick={copyToClipboard} className="flex-shrink-0">
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-[var(--radius-lg)] bg-primary-50 border border-primary-100 flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary-600 mt-0.5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-primary-700 leading-relaxed">
                  Only your itinerary and public notes are shared. Budget items and packing lists remain private to you.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
