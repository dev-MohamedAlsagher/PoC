'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState(null);
  const searchParams = useSearchParams();
  const { isLoading } = useUser();

  const resetStats = () => {
    sessionStorage.removeItem('loginMethod');
    sessionStorage.removeItem('loginStart');
    setStats(null);
  };

  function getBrowserName() {
    const ua = navigator.userAgent;

    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  useEffect(() => {
    const loginMethod = sessionStorage.getItem('loginMethod');
    const loginStartStr = sessionStorage.getItem('loginStart');
    const loginStart = loginStartStr ? parseInt(loginStartStr, 10) : null;
    const duration = loginStart ? Date.now() - loginStart : null;

    if (loginMethod) {
      const newStats = {
        loginMethod,
        durationMs: Math.round(duration ?? 0),
        browser: getBrowserName(),
        status: 'unknown',
      };

      const isFailed = window.confirm('Was this login attempt a failure? Click "OK" for Yes, "Cancel" for No.');
      newStats.status = isFailed ? 'failed' : 'success';

      setStats(newStats);

      fetch('/api/log-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStats),
      })
        .then(res => res.json())
        .then(() => {
          resetStats();
        })
        .catch(err => console.error('❌ error:', err));
    }
  }, [searchParams.toString()]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '700px',
        margin: 'auto',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#2c3e50', fontSize: '2.5rem' }}>
        Passkeys vs Two-Factor Authentication
      </h1>

      <p style={{ fontSize: '1.1rem', marginTop: '1rem', color: '#444' }}>
        Deze site test en vergelijkt de <strong>performance</strong> van inloggen met
        <strong> passkeys</strong> versus <strong>2FA</strong>. We meten:
      </p>
      <ul style={{ textAlign: 'left', margin: '1rem auto', maxWidth: '500px', color: '#555' }}>
        <li><strong>Laadtijd</strong> (tijd tussen login start en bevestiging)</li>
        <li><strong>Faalpercentage</strong> (hoe vaak login mislukt)</li>
        <li><strong>Browserverschillen</strong> tussen Chrome, Safari, Firefox, etc.</li>
      </ul>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <Link href="/stats">
          <button style={buttonStyle}>Bekijk Statistieken</button>
        </Link>
        <Link href="/raw">
          <button style={buttonStyle}>Bekijk Raw Data</button>
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#2980b9',
  color: '#fff',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
};

