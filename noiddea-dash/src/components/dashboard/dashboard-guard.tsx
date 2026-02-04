'use client';

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/providers/session-provider';
import { Spinner } from '@/components/ui/spinner';
import { isNative } from '@/lib/native';

interface DashboardGuardProps {
  children: React.ReactNode;
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const session = useSession();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);
  const hasTokenRef = useRef(false);

  // Check for token on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkToken = () => {
      const token = isNative()
        ? localStorage.getItem('kapok-session-token') || document.cookie.split(';').find(c => c.trim().startsWith('kapok-session-token='))?.split('=')[1]?.trim()
        : document.cookie.split(';').find(c => c.trim().startsWith('kapok-session-token='))?.split('=')[1]?.trim() || localStorage.getItem('kapok-session-token');
      
      hasTokenRef.current = !!token;
    };
    
    checkToken();
    
    // Listen for token changes
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Wait for session to load
    if (session.loading) {
      return;
    }

    // Check if we have a token - if yes, don't redirect during navigation
    const hasTokenFromRef = hasTokenRef.current;
    const hasTokenFromStorage = typeof window !== 'undefined' && (
      localStorage.getItem('kapok-session-token') ||
      document.cookie.includes('kapok-session-token=')
    );
    const hasToken = hasTokenFromRef || hasTokenFromStorage;

    // If we have a token, allow access (preserve during navigation)
    if (hasToken) {
      hasRedirectedRef.current = false;
      
      // Only redirect cashier to session, not to auth
      if (session.isCashier && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        navigate('/dashboard/sessions', { replace: true });
        return;
      }
      
      // Allow access for authenticated users with token
      return;
    }

    // Only redirect if no token and not authenticated (initial load without token)
    if (!hasToken && !session.authenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      navigate('/login', { replace: true });
      return;
    }
  }, [session.loading, session.authenticated, session.hasBusiness, session.isOwner, session.isCashier, navigate]);

  // Show loading while checking session
  if (session.loading) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner />
      </div>
    );
  }

  // If we have a token, always allow access (even if session check fails temporarily)
  const hasToken = typeof window !== 'undefined' && (
    localStorage.getItem('kapok-session-token') ||
    document.cookie.includes('kapok-session-token=')
  );

  if (hasToken) {
    return <>{children}</>;
  }

  // If no token and not authenticated, show spinner (redirecting)
  if (!session.authenticated) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
