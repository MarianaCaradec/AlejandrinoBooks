"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchAuth } from "@/utils/fetchs";
import { user } from "@prisma/client";

interface AuthContextType {
  isAuthenticated: boolean;
  user: user | null;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<user | null>(null);
  const pathName = usePathname();

  const checkAuth = async () => {
    try {
      const data = await fetchAuth();
      if (data) {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error al confirmar autenticación del usuario", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathName]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
