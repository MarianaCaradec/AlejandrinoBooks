"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCartItemContext } from "@/app/contexts/CartItemContext";
import Link from "next/link";
import { useEffect } from "react";

const page = () => {
  const { setCartItems } = useCartItemContext();

  const checkPaymentStatus = async () => {
    const { user } = useAuth();
    const userId = user ? user.id : "";

    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("payment_id");
    const orderId = urlParams.get("order_id");

    if (!orderId) {
      console.error("Order ID is missing from the URL.");
      return;
    }

    if (paymentId) {
      const payment = await fetch(
        `/api/payment/status?payment_id=${paymentId}&order_id=${orderId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const paymentData = await payment.json();
      console.log("Payment data: ", paymentData);

      if (paymentData.status === "approved" && orderId) {
        await fetch("/api/payment/completed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

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
      } else {
        console.log("Payment not approved yet or failed.");
      }
    }
  };

  useEffect(() => {
    if (window.location.search.includes("payment_id")) {
      checkPaymentStatus();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-20">
      <h1 className="text-3xl font-bold text-[#D4B483] mb-6">
        Payment Success
      </h1>
      <p className="text-[#E4DFDA]">Your payment was successful!</p>
      <p className="text-[#E4DFDA]">Thank you for your purchase.</p>
      <Link
        href={"/"}
        className="bg-[#53917E] text-black font-bold px-4 py-2 rounded-md hover:bg-[#D4B483] transition"
      >
        Go back to landing page
      </Link>
    </div>
  );
};

export default page;
