"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getJwtPayload } from "@/utils/jwt";

type AuthContextType = {
  accessToken: string | null;
  roles: string[];
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = getJwtPayload(token);
      setAccessToken(token);
      setRoles(payload?.roles || []);
    }
    setLoading(false);
  }, []);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);

    const payload = getJwtPayload(token);

    setAccessToken(token);
    setRoles(payload?.roles ?? []);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        roles,
        isAuthenticated: !!accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return context;
}
