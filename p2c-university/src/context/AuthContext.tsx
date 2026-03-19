import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CUUser {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  creator_type: string;
  tiktok_handle?: string;
  instagram_handle?: string;
  youtube_handle?: string;
  snapchat_handle?: string;
  badge_status: string;
  tier: string;
  total_views: number;
  tiktok_views: number;
  instagram_views: number;
  youtube_views: number;
  snapchat_views: number;
  total_earnings_cents: number;
  stripe_onboarded: boolean;
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  creator_type: string;
  tiktok_handle?: string;
  instagram_handle?: string;
  youtube_handle?: string;
  snapchat_handle?: string;
}

interface AuthContextType {
  user: CUUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CUUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("cu_token"));
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async (jwt: string): Promise<CUUser | null> => {
    try {
      const res = await fetch("/api/cu/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.creator;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe(token).then((u) => {
        setUser(u);
        if (!u) {
          localStorage.removeItem("cu_token");
          setToken(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/cu/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Login failed" }));
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("cu_token", data.token);
    setToken(data.token);
    setUser(data.creator);
  };

  const signup = async (formData: SignupData) => {
    const res = await fetch("/api/cu/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Signup failed" }));
      throw new Error(err.error || "Signup failed");
    }
    const data = await res.json();
    localStorage.setItem("cu_token", data.token);
    setToken(data.token);
    setUser(data.creator);
  };

  const logout = () => {
    localStorage.removeItem("cu_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    const u = await fetchMe(token);
    if (u) setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
