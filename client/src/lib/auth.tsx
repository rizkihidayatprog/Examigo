import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'ADMIN';
  plan: 'FREE' | 'PERSONAL' | 'PRO_AI' | 'ENTERPRISE';
  planValidUntil?: string;
  avatarUrl?: string;
  aiQuotaUsed: number;
  aiQuotaLimit: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = '/api';

export function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('examigo_token');
  const isFormData = options.body instanceof FormData;
  
  const headers: HeadersInit = {
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
    return JSON.parse(text);
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

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
