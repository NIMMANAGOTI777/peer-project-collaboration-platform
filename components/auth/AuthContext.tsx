'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  installDemoInterceptor,
  isDemoModeActive,
  showDemoToast,
} from '@/lib/demo/demoInterceptor';
import { DEMO_COOKIE_NAME, getDemoUserByRole } from '@/lib/demo/demoState';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  profile?: {
    id: string;
    bio?: string;
    interests?: string;
    availability?: string;
    experience?: string;
    department?: string;
    year?: string;
    githubUsername?: string;
    avatarUrl?: string;
  } | null;
  studentSkills?: Array<{
    id: string;
    skill: { id: string; name: string; category: string };
    proficiency: string;
  }>;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isDemo: boolean;
  demoRole: 'STUDENT' | 'ADMIN' | null;
  enterDemo: (role: 'STUDENT' | 'ADMIN') => void;
  exitDemo: () => void;
  login: (data: any) => Promise<{ ok: boolean; error?: string; role?: string }>;
  register: (data: any) => Promise<{ ok: boolean; error?: string; role?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoState, setDemoState] = useState<{ isDemo: boolean; role: 'STUDENT' | 'ADMIN' | null }>({
    isDemo: false,
    role: null,
  });
  const router = useRouter();

  // Install interceptor on client mount
  useEffect(() => {
    installDemoInterceptor();
    setDemoState(isDemoModeActive());
  }, []);

  const refreshUser = async () => {
    try {
      const activeDemo = isDemoModeActive();
      setDemoState(activeDemo);

      if (activeDemo.isDemo && activeDemo.role) {
        const demoUser = getDemoUserByRole(activeDemo.role);
        setUser(demoUser as unknown as UserSession);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const enterDemo = (role: 'STUDENT' | 'ADMIN') => {
    document.cookie = `${DEMO_COOKIE_NAME}=${role}; path=/; max-age=86400`;
    setDemoState({ isDemo: true, role });
    const demoUser = getDemoUserByRole(role);
    setUser(demoUser as unknown as UserSession);
    showDemoToast(
      `Entered Demo Mode as ${role === 'ADMIN' ? 'Administrator' : 'Student (Karthik Rao)'} (No registration or login needed).`,
      'success'
    );
    if (role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const exitDemo = () => {
    document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setDemoState({ isDemo: false, role: null });
    setUser(null);
    showDemoToast('Exited demo mode.', 'info');
    router.push('/');
    setTimeout(() => {
      window.location.href = '/';
    }, 150);
  };

  const login = async (credentials: any) => {
    try {
      // Clear demo cookie if logging in with real credentials
      document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setDemoState({ isDemo: false, role: null });

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Failed to login' };
      }
      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Login error' };
    }
  };

  const register = async (formData: any) => {
    try {
      document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setDemoState({ isDemo: false, role: null });

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Failed to register' };
      }
      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Registration error' };
    }
  };

  const logout = async () => {
    try {
      document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setDemoState({ isDemo: false, role: null });
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo: demoState.isDemo,
        demoRole: demoState.role,
        enterDemo,
        exitDemo,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
