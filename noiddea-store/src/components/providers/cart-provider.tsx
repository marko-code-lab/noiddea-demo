"use client";

import * as React from "react";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CartProduct } from "@/types";

export const CartContext = createContext<{ 
  cart: CartProduct[], 
  addToCart: (product: CartProduct, presentationId?: string, quantity?: number) => void, 
  removeFromCart: (productId: string) => void, 
  updateQuantity: (productId: string, quantity: number) => void,
  updatePresentation: (productId: string, presentationId: string) => void,
  clearCart: () => void 
}>({ 
  cart: [], 
  addToCart: () => {}, 
  removeFromCart: () => {}, 
  updateQuantity: () => {},
  updatePresentation: () => {},
  clearCart: () => {} 
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const addToCart = useCallback((product: CartProduct, presentationId?: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        return prev.map((p) => 
          p.id === product.id 
            ? { ...p, quantity: p.quantity + quantity } 
            : p
        );
      }
      
      // Determinar la presentación por defecto
      let defaultPresentation: string | undefined;
      
      if (presentationId) {
        // Si se especifica una presentación, usarla
        defaultPresentation = presentationId;
      } else if (product.presentations.length > 0) {
        // Buscar "unidad" primero
        const unidadPresentation = product.presentations.find(
          (p: CartProduct['presentations'][0]) => p.variant.toLowerCase() === 'unidad'
        );
        // Si existe "unidad", usarla; si no, usar la primera disponible
        defaultPresentation = unidadPresentation?.id || product.presentations[0]?.id;
      }
      
      return [...prev, { 
        ...product, 
        quantity: quantity,
        selectedPresentationId: defaultPresentation 
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== productId));
      return;
    }
    setCart((prev) => prev.map((p) => p.id === productId ? { ...p, quantity } : p));
  }, []);

  const updatePresentation = useCallback((productId: string, presentationId: string) => {
    setCart((prev) => prev.map((p) => 
      p.id === productId ? { ...p, selectedPresentationId: presentationId } : p
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updatePresentation,
    clearCart
  }), [cart, addToCart, removeFromCart, updateQuantity, updatePresentation, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}