'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartState, ShopifyCart } from '@/types';
import {
  createCart,
  addToCart as shopifyAddToCart,
  removeFromCart as shopifyRemoveFromCart,
  updateCartLine,
  getCart,
} from '@/lib/shopify';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/analytics';

const CART_ID_KEY = 'wildora_cart_id';

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCartId = typeof window !== 'undefined' ? localStorage.getItem(CART_ID_KEY) : null;
    if (savedCartId) {
      getCart(savedCartId)
        .then((c) => {
          if (c) setCart(c);
          else localStorage.removeItem(CART_ID_KEY);
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY));
    }
  }, []);

  const getOrCreateCart = useCallback(async (): Promise<ShopifyCart> => {
    if (cart) return cart;

    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (savedCartId) {
      try {
        const existing = await getCart(savedCartId);
        if (existing) {
          setCart(existing);
          return existing;
        }
      } catch {
        // cart expired or invalid
      }
    }

    const newCart = await createCart();
    localStorage.setItem(CART_ID_KEY, newCart.id);
    setCart(newCart);
    return newCart;
  }, [cart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const currentCart = await getOrCreateCart();
        const updatedCart = await shopifyAddToCart(currentCart.id, variantId, quantity);
        setCart(updatedCart);

        // Find added item for analytics
        const line = updatedCart.lines.nodes.find(
          (l) => l.merchandise.id === variantId
        );
        if (line) {
          trackAddToCart({
            id: line.merchandise.product.id,
            name: line.merchandise.product.title,
            variantId,
            price: parseFloat(line.cost.amountPerQuantity.amount),
            currency: line.cost.amountPerQuantity.currencyCode,
            quantity,
          });
        }

        setIsOpen(true);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [getOrCreateCart]
  );

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        // Track before removal
        const line = cart.lines.nodes.find((l) => l.id === lineId);
        if (line) {
          trackRemoveFromCart({
            id: line.merchandise.product.id,
            name: line.merchandise.product.title,
            price: parseFloat(line.cost.amountPerQuantity.amount),
            currency: line.cost.amountPerQuantity.currencyCode,
            quantity: line.quantity,
          });
        }

        const updatedCart = await shopifyRemoveFromCart(cart.id, [lineId]);
        setCart(updatedCart);
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        if (quantity <= 0) {
          await removeFromCart(lineId);
          return;
        }
        const updatedCart = await updateCartLine(cart.id, lineId, quantity);
        setCart(updatedCart);
      } catch (err) {
        console.error('Failed to update cart quantity:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, removeFromCart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartState {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
