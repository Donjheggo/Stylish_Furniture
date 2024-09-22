import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/context/auth-context";
import { GetCartItems } from "~/lib/actions/profile";
import { GetCarts } from "~/lib/actions/carts";
import { GetTotalShippingAndTotalPrice } from "~/lib/actions/checkout";
import type { CartItemT } from "~/app/(tabs)/cart";

// Create a CartContext
const CartContext = createContext({
  cartTotal: 0,
  carts: [] as CartItemT[],
  prices: {
    totalPrice: 0,
    totalShipping: 0,
    totalPayable: 0,
  },
  fetchCartData: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [carts, setCarts] = useState<CartItemT[]>([]);
  const [prices, setPrices] = useState({
    totalPrice: 0,
    totalShipping: 0,
    totalPayable: 0,
  });

  // Unified function to fetch both cart and price data
  const fetchCartData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [cartItems, cartPrices] = await Promise.all([
        GetCarts(user.id),
        GetTotalShippingAndTotalPrice(user.id),
      ]);

      setCarts(cartItems || []);
      setPrices({
        totalPrice: cartPrices?.totalPrice || 0,
        totalShipping: cartPrices?.totalShippingFee || 0,
        totalPayable: cartPrices?.totalPayable || 0,
      });

      const total = await GetCartItems(user.id);
      setCartTotal(total || 0);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCartData();

    // Set up Supabase subscription for real-time updates
    const channel = supabase
      .channel("public:carts")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to any cart changes for this user
          schema: "public",
          table: "carts",
          filter: `user_id=eq.${user?.id}`,
        },
        fetchCartData // Trigger fetch on cart change
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Clean up subscription
    };
  }, [user?.id, fetchCartData]);

  return (
    <CartContext.Provider value={{ cartTotal, carts, prices, fetchCartData }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => useContext(CartContext);
