import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { cartService } from '../services/api'; // Import cartService
import { useAuth } from './AuthContext'; // Import useAuth to get user info

// Types matching our Prisma schema
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
}

export interface CartItem {
  id: number;
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (menuItem: MenuItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth(); // Get user from AuthContext

  const fetchCart = useCallback(async () => {
    if (!user) { // Only fetch if user is logged in
      setCartItems([]);
      return;
    }
    try {
      const response = await cartService.getCart();
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]); // Clear cart if fetch fails
    }
  }, [user]); // Only recreate fetchCart if user changes

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]); // Added fetchCart to dependency array

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (menuItem: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.menuItemId === menuItem.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.menuItemId === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, {
        id: Date.now(),
        menuItemId: menuItem.id,
        menuItem,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}; 