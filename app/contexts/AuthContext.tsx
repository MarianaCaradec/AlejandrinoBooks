"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchAuth } from "@/utils/fetchs";
import { User } from "@prisma/client";
import { logout } from "../actions/logout";
import { useCartItemContext } from "./CartItemContext";
import { prisma } from "../lib/prisma";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkAuth: () => Promise<void>;
  logoutHandler: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const hasCheckedAuth = useRef(false);
  const { setCartItems } = useCartItemContext();

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
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []);

  const logoutHandler = async (userId: string) => {
    await fetch("/api/payment", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    setCartItems([]);

    console.log("Pending order and cart items deleted before logout.");

    logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        checkAuth,
        logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
