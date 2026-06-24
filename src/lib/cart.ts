"use client";

import { useEffect, useMemo, useState } from "react";
import { menuItems, type MenuItem } from "@/data/menu";

export type CartEntry = {
  id: number;
  quantity: number;
};

export type CartItem = MenuItem & {
  quantity: number;
};

const CART_KEY = "noirtable-cart";

function readCart(): CartEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = window.localStorage.getItem(CART_KEY);
    return savedCart ? (JSON.parse(savedCart) as CartEntry[]) : [];
  } catch {
    return [];
  }
}

function writeCart(cart: CartEntry[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("noirtable-cart-change"));
}

export function useCart() {
  const [entries, setEntries] = useState<CartEntry[]>([]);

  useEffect(() => {
    function syncCart() {
      setEntries(readCart());
    }

    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener("noirtable-cart-change", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("noirtable-cart-change", syncCart);
    };
  }, []);

  const items = useMemo<CartItem[]>(
    () =>
      entries
        .map((entry) => {
          const item = menuItems.find((menuItem) => menuItem.id === entry.id);
          return item ? { ...item, quantity: entry.quantity } : null;
        })
        .filter((item): item is CartItem => item !== null),
    [entries],
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function update(nextEntries: CartEntry[]) {
    setEntries(nextEntries);
    writeCart(nextEntries);
  }

  function addItem(item: MenuItem) {
    const existingItem = entries.find((entry) => entry.id === item.id);

    if (!existingItem) {
      update([...entries, { id: item.id, quantity: 1 }]);
      return;
    }

    update(
      entries.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry,
      ),
    );
  }

  function removeItem(itemId: number) {
    update(
      entries
        .map((entry) =>
          entry.id === itemId
            ? { ...entry, quantity: entry.quantity - 1 }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }

  function clearCart() {
    update([]);
  }

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    clearCart,
  };
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
