"use client";
import { DatabaseError, RedirectionError } from "@/errorHandler";
import { fetchBook, fetchCart } from "@/utils/fetchs";
import { CartItem } from "@prisma/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItemWithBook, OrderItemWithBook } from "../lib/prisma";

interface CartItemContextType {
  cartItems: CartItemWithBook[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemWithBook[]>>;
  handleAddItem: (bookId: string) => Promise<void>;
  handleRemoveItem: (
    cartId: string,
    bookId: string,
    itemId: string
  ) => Promise<void>;
  handlePayItems: (
    userId: string,
    orderItems: OrderItemWithBook[]
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

      if (!res.ok) throw new DatabaseError("Error adding the book:");

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

    if (!res.ok) throw new DatabaseError("Couldn't remove the book:");

    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handlePayItems = async (
    userId: string,
    orderItems: OrderItemWithBook[]
  ) => {
    if (!userId) throw new DatabaseError("Missing userId.");

    if (!orderItems || orderItems.length === 0)
      throw new DatabaseError("OrderItems array is empty.");

    const paymentRes = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, orderItems }),
    });

    if (!paymentRes.ok) throw new DatabaseError("Couldn't do the payment:");

    const paymentData = await paymentRes.json();

    if (paymentData && paymentData.init_point) {
      window.location.href = paymentData.init_point;
      pollPaymentStatus(paymentData.orderId);
    } else {
      throw new RedirectionError("Payment link not generated");
    }
  };

  const pollPaymentStatus = async (
    orderId: string,
    maxAttempts: number = 10,
    interval: number = 5000
  ) => {
    let attempts = 0;

    const checkStatus = async () => {
      attempts++;
      console.log(`Polling attempt ${attempts}...`);

      const res = await fetch(`/api/payment/status?orderId=${orderId}`);
      const data = await res.json();

      if (data.status === "COMPLETED") {
        console.log("Payment completed!");

        const updateRes = await fetch("/api/payment", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderId, status: "COMPLETED" }),
        });

        if (!updateRes.ok) {
          const errorData = await updateRes.json();
          throw new Error(
            `Failed to update order: ${errorData.error || "Unknown error"}`
          );
        }

        console.log("Order status updated successfully.");

        setCartItems([]);
        window.location.href = "/";
        return true;
      }

      if (attempts >= maxAttempts) {
        console.error("Polling timed out.");
        throw new Error("Payment not completed.");
      }

      // Retry after interval
      setTimeout(checkStatus, interval);
    };

    checkStatus();
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
        handlePayItems,
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
