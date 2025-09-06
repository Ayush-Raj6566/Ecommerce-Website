import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  itemId: string;
  userId: string;
  qty: number;
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (itemId: string, qty: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch cart when token changes
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token]);

  const fetchCart = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/cart`);
      setCartItems(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId: string, qty: number) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/cart/add`, { itemId, qty });
      await fetchCart(); // Refresh cart after adding item
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
      setError(errorMessage);
      console.error('Add to cart error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      await axios.post(`${API_URL}/cart/remove`, { itemId });
      await fetchCart(); // Refresh cart after removing item
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove item from cart';
      setError(errorMessage);
      console.error('Remove from cart error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, qty: number) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      await axios.put(`${API_URL}/cart/update`, { itemId, qty });
      await fetchCart(); // Refresh cart after updating item
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart item';
      setError(errorMessage);
      console.error('Update cart item error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/cart/clear`);
      setCartItems([]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      console.error('Clear cart error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};