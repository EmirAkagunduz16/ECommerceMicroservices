"use client";

import Link from "next/link";
import React from "react";
import { ShoppingCart } from "lucide-react";
import useCartStore from "@/stores/cartStore";
import { CartItemType } from "@/types";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();

  if (!hasHydrated) return null;

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-4 h-4 text-gray-600 " />
      <span className="absolute -top-3 -right-3 bg-amber-400 text-xs font-medium text-gray-600 rounded-full w-4 h-4 flex items-center justify-center">
        {cart.reduce(
          (acc: number, item: CartItemType) => acc + item.quantity,
          0
        )}
      </span>
    </Link>
  );
};

export default ShoppingCartIcon;
