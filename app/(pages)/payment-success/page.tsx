"use client";
import { useCartItemContext } from "@/app/contexts/CartItemContext";
import Link from "next/link";
import { useEffect } from "react";

const page = () => {
  const { setCartItems } = useCartItemContext();

  const checkPaymentStatus = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("payment_id");

    if (paymentId) {
      const payment = await fetch(
        `/api/payment/status?paymentId=${paymentId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const paymentData = await payment.json();

      if (paymentData.status === "approved") {
        await fetch("/api/payment/completed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: paymentData.metadata.orderId }),
        });

        setCartItems([]);
      } else {
        console.log("Payment not approved yet or failed.");
      }
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  return (
    <div>
      <h1>Payment Success</h1>
      <p>Your payment was successful!</p>
      <p>Thank you for your purchase.</p>
      <Link
        href={"/"}
        className="bg-[#53917E] text-black font-bold px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Go back to landing page
      </Link>
    </div>
  );
};

export default page;
