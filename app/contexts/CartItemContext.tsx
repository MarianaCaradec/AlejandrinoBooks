"use client";
import { fetchBook, fetchCart } from "@/utils/fetchs";
import { CartItem } from "@prisma/client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItemWithBook extends CartItem {
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  bookPrice: number;
}

interface CartItemContextType {
  cartItems: CartItemWithBook[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemWithBook[]>>;
  handleAddItem: (bookId: string) => Promise<void>;
  handleRemoveItem: (
    cartId: string,
    bookId: string,
    itemId: string
  ) => Promise<void>;
  totalQuantity: number;
}

const CartItemContext = createContext<CartItemContextType | undefined>(
  undefined
);

export function CartItemProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemWithBook[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCart();

        if (data && Array.isArray(data)) {
          const cartItemsWithBook = await Promise.all(
            data.map(async (item: CartItem) => {
              const book = await fetchBook(item.bookId);
              return {
                ...item,
                bookTitle: book?.title || "Unknown Title",
                bookAuthor: book?.author || "Unknown Author",
                bookImage: book?.image || "/default-book-image.jpg",
                bookPrice: Number(book?.price) || 0,
              };
            })
          );

          setCartItems(cartItemsWithBook);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setCartItems([]);
      }
    };

    getData();
  }, []);

  const handleAddItem = async (bookId: string) => {
    try {
      const res = await fetch("/api/cartItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error adding the book:", errorData.error);
        return;
      }

      const newItem: CartItem = await res.json();
      const book = await fetchBook(bookId);
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

        return [
          ...prevItems,
          {
            ...newItem,
            bookTitle: book?.title || "Unknown Title",
            bookAuthor: book?.author || "Unknown Author",
            bookImage: book?.image || "/default-book-image.jpg",
            bookPrice: Number(book?.price) || 0,
          },
        ];
      });
    } catch (error) {
      console.error("Error fetching cart item:", error);
    }
  };

  const handleRemoveItem = async (
    cartId: string,
    bookId: string,
    itemId: string
  ) => {
    const res = await fetch("/api/cartItem", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, bookId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Couldn't remove the book:", errorData.error);
      return;
    }

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const totalQuantity = React.useMemo(() => {
    return Array.isArray(cartItems)
      ? cartItems.reduce((acc, items) => acc + items.quantity, 0)
      : 0;
  }, [cartItems]);

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
