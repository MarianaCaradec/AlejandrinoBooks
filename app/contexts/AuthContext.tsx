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
  logoutHandler: () => void;
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

  const logoutHandler = async () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);

    if (user && user.id) {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { cartItems: true },
      });

      if (cart && cart.cartItems.length > 0) {
        await Promise.all(
          cart.cartItems.map(async (item) => {
            await prisma.book.update({
              where: { id: item.bookId },
              data: { stock: { increment: item.quantity } },
            });
          })
        );

        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        await prisma.cart.delete({
          where: { id: cart.id },
        });
      }

      setCartItems([]);
    }
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
