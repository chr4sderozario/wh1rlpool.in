import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  team: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const idx = s.items.findIndex((i) => i.productId === item.productId && i.size === item.size);
          if (idx > -1) {
            const items = [...s.items];
            items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
            return { items };
          }
          return { items: [...s.items, item] };
        }),
      removeItem: (productId, size) =>
        set((s) => ({ items: s.items.filter((i) => !(i.productId === productId && i.size === size)) })),
      updateQty: (productId, size, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity: Math.max(1, qty) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    { name: "wh1rlpool-cart" },
  ),
);
