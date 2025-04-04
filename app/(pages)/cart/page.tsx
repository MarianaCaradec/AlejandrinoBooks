"use client";

import { useCartItemContext } from "@/app/contexts/CartItemContext";
import Image from "next/image";

export default function page() {
  const { cartItems, totalQuantity, handleRemoveItem } = useCartItemContext();

  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <h2 className="text-3xl text-center font-bold text-[#D4B483] mb-6">
        Welcome to your cart
      </h2>
      <h3 className="text-2xl text-center font-bold text-[#D4B483] mb-6">
        These are your current items:
      </h3>
      <div>
        {cartItems.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-[#D4B483] p-4 rounded-md shadow-md"
                >
                  <div>
                    <h2 className="text-xl font-semibold">
                      {item.bookTitle} by {item.bookAuthor}
                    </h2>
                    <Image
                      src={item.bookImage}
                      width={150}
                      height={200}
                      alt="Book's cover"
                      className="rounded-lg"
                    />
                    <p className="text-sm text-gray-700">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-black">
                    ${Number(item.bookPrice)}
                  </p>
                  <button
                    onClick={() =>
                      handleRemoveItem(item.cartId, item.bookId, item.id)
                    }
                    className="bg-[#53917E] text-black font-bold px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Remove item
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h2 className="text-2xl font-bold">
                Total Items: {totalQuantity}
              </h2>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
