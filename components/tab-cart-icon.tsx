import { ShoppingCart } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { Text } from "./ui/text";
import { GetCartItems } from "~/lib/actions/profile";
import { useState, useEffect } from "react";
import { useAuth } from "~/context/auth-context";
import { supabase } from "~/lib/supabase";

export default function ShoppingCartIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  const { user } = useAuth();
  const [cartTotal, setCartTotal] = useState<number>(0);

  const fetchCart = async () => {
    const total = await GetCartItems(user?.id || "");
    setCartTotal(total || 0);
  };
  useEffect(() => {
    fetchCart();

    const subscription = supabase
      .channel("public:carts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "carts",
          filter: `user_id=eq.${user?.id}`,
        },
        fetchCart
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <ShoppingCart size={size} color={color} />
      {cartTotal > 0 && (
        <View style={styles.badgeContainer} className="rounded-full">
          <Text className="text-muted-foreground text-lg font-semibold">
            {cartTotal}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    right: -12,
    top: -10,
  },
});
