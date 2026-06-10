import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { getCart, saveCart } from '@/lib/storage';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQty: (productId: string, qty: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => getCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { saveCart(items); }, [items]);

  const getKey = (productId: string, size?: string) => `${productId}_${size || 'nosize'}`;

  const addToCart = (product: Product, qty = 1, size?: string) => {
    setItems(prev => {
      const key = getKey(product.id, size);
      const existing = prev.find(i => getKey(i.product.id, i.size) === key);
      if (existing) {
        return prev.map(i =>
          getKey(i.product.id, i.size) === key
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty, size }];
    });
    toast.success('কার্টে যোগ করা হয়েছে!', {
      description: `${product.nameBn}${size ? ` — সাইজ: ${size}` : ''}`,
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    const key = getKey(productId, size);
    setItems(prev => prev.filter(i => getKey(i.product.id, i.size) !== key));
  };

  const updateQty = (productId: string, qty: number, size?: string) => {
    const key = getKey(productId, size);
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems(prev => prev.map(i =>
      getKey(i.product.id, i.size) === key ? { ...i, quantity: qty } : i
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQty, clearCart,
      totalItems, totalPrice, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
