import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'ADMIN';
  plan: 'FREE' | 'PERSONAL' | 'PRO_AI' | 'ENTERPRISE';
  planValidUntil?: string;
  avatarUrl?: string;
  institution?: string;
  phone?: string;
  position?: string;
  bio?: string;
  aiQuotaUsed: number;
  aiQuotaLimit: number;
  createdAt: string;
  examsCount?: number;
  questionsCount?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (u: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function isProfileComplete(user: User | null): boolean {
  if (!user) return true;
  if (user.role === 'ADMIN') return true;
  return Boolean(
    user.name && user.name.trim().length > 0 &&
    user.institution && user.institution.trim().length > 0 &&
    user.phone && user.phone.trim().length > 0
  );
}

const API_BASE = '/api';

export function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('examigo_token');
  const isFormData = options.body instanceof FormData;
  
  const headers: HeadersInit = {
    'X-Requested-With': 'XMLHttpRequest',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
}

export async function safeJson(res: Response) {
  const text = await res.text();
  if (!text || !text.trim()) {
    return { success: false, message: 'Server mengembalikan respon kosong' };
  }
  try {
    const data = JSON.parse(text);
    if (res.status === 503 && data?.inMaintenance && data?.scope !== 'feature') {
      window.dispatchEvent(new CustomEvent('examigo:maintenance', { 
        detail: {
          enabled: true,
          title: data.title,
          message: data.message,
          estimatedEndTime: data.estimatedEndTime,
          allowAdminLogin: data.allowAdminLogin ?? true
        } 
      }));
    }
    return data;
  } catch (err) {
    console.error('SafeJson Parse Error:', err, text);
    return {
      success: false,
      message: `Format respon server tidak valid (${res.status}): ${text.slice(0, 80)}`,
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('examigo_token'));
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((t: string, u: User) => {
    localStorage.setItem('examigo_token', t);
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('examigo_token');
    setToken(null);
    setUser(null);
  }, []);

  // Check token on mount
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    api('/auth/me')
      .then((res) => safeJson(res))
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await safeJson(res);
    if (!data.success) throw new Error(data.message || 'Gagal masuk');
    setAuth(data.data.token, data.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await safeJson(res);
    if (!data.success) throw new Error(data.message || 'Gagal mendaftar');
    setAuth(data.data.token, data.data.user);
  };

  const updateUser = useCallback((u: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...u } : null));
  }, []);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem('examigo_token');
    if (!t) return;
    try {
      const res = await api('/auth/me');
      const data = await safeJson(res);
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, updateUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
