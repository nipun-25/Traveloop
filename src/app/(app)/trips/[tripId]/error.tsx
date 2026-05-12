'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Trip Detail Page Error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        background: 'rgba(255, 107, 107, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff6b6b',
        marginBottom: 32,
        border: '1px solid rgba(255, 107, 107, 0.2)'
      }}>
        <AlertCircle size={40} />
      </div>

      <h1 style={{ fontSize: 32, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
        Oops! Adventure Interrupted
      </h1>
      
      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 500, marginBottom: 40, lineHeight: 1.6 }}>
        Something went wrong while loading your trip details. This could be a temporary connection issue.
      </p>

      {error.digest && (
        <div style={{ 
          fontSize: 12, 
          color: 'rgba(255,255,255,0.3)', 
          marginBottom: 32,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          Error ID: {error.digest}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '16px 32px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.3s'
          }}
        >
          <RefreshCw size={18} /> Try Again
        </button>
        
        <Link 
          href="/dashboard"
          style={{
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            border: '1px solid var(--outline-variant)',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.3s'
          }}
        >
          <Home size={18} /> Back Home
        </Link>
      </div>
    </div>
  );
}
