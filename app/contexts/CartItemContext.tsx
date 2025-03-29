"use client";
import { CartItem } from "@prisma/client";
import React, { createContext, useContext, useState } from "react";

type CartItemContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleAddItem: (bookId: string) => Promise<void>;
  handleRemoveItem: (itemId: string) => Promise<void>;
  totalQuantity: number;
};

const CartItemContext = createContext<CartItemContextType | undefined>(
  undefined
);

export function CartItemProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddItem = async (bookId: string) => {
    try {
      const res = await fetch("/api/cartItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al agregar el libro:", errorData.error);
        return;
      }

      const newItem: CartItem = await res.json();
      setCartItems((prevItems) => {
        const existingItem = prevItems?.find(
          (cartItem) => cartItem.id === newItem.id
        );

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prevItems, newItem];
      });
    } catch (error) {
      console.error("Error fetching cart item:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const res = await fetch("/api/cartItem", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Couldn't remove the book:", errorData.error);
      return;
    }

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const totalQuantity = React.useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <CartItemContext.Provider
      value={{
        cartItems,
        setCartItems,
        handleAddItem,
        handleRemoveItem,
        totalQuantity,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
}

export function useCartItemContext() {
  const context = useContext(CartItemContext);

  if (!context)
    throw new Error(
      "useCartItemContext must be used within a CartItemProvider"
    );

  return context;
}
