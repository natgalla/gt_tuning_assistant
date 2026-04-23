"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string, displayName?: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      return data.error ?? "Login failed";
    }
    const data = await res.json();
    setUser(data);
    return null;
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName?: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    if (!res.ok) {
      const data = await res.json();
      return data.error ?? "Signup failed";
    }
    const data = await res.json();
    setUser(data);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, login, signup, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
