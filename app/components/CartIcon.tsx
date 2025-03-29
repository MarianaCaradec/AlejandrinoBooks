"use client";

import { useCartItemContext } from "../contexts/CartItemContext";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIcon() {
  const { totalQuantity } = useCartItemContext();

  return (
    <div className="relative cursor-pointer">
      <button aria-label="View cart" className="relative cursor-pointer">
        <FaShoppingCart size={24} className="text-[#E4DFDA]" />
        <span className="absolute -top-1 -right-2 bg-[#53917E] text-[#E4DFDA] rounded-full px-2 py-0.5 text-xs font-bold">
          {totalQuantity}
        </span>
      </button>
    </div>
  );
}
