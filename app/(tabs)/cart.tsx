import { View, SafeAreaView, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import CartCard from "~/components/carts/cart-card";
import { GetCarts } from "~/lib/actions/carts";
import { useAuth } from "~/context/auth-context";
import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { GetTotalShippingAndTotalPrice } from "~/lib/actions/checkout";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  const { user } = useAuth();
  const [carts, setCarts] = useState<CartItemT[]>([]);
  const [prices, setPrices] = useState({
    totalPrice: 0,
    totalShipping: 0,
    totalPayable: 0,
  });

  const fetchCartAndPrices = async () => {
    const carts = await GetCarts(user?.id || "");
    setCarts(carts || []);

    const data = await GetTotalShippingAndTotalPrice(user?.id || "");
    setPrices({
      totalPrice: data?.totalPrice || 0,
      totalShipping: data?.totalShippingFee || 0,
      totalPayable: data?.totalPayable || 0,
    });
  };

  useEffect(() => {
    fetchCartAndPrices();

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
        fetchCartAndPrices
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="px-5">
          {carts.map((item, index) => (
            <CartCard key={index} item={item} />
          ))}
          <View className="mt-5">
            <View className="flex-row items-center justify-between flex-1">
              <View>
                <Text>Price:</Text>
              </View>
              <View>
                <Text>₱ {prices.totalPrice.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between flex-1">
              <View>
                <Text>Total Shipping:</Text>
              </View>
              <View>
                <Text>₱ {prices.totalShipping.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between flex-1">
              <View>
                <Text>Total Payable:</Text>
              </View>
              <View>
                <Text className="text-2xl font-semibold">
                  ₱ {prices.totalPayable.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          <Button
            size="lg"
            className="mt-2"
            onPress={() => router.push("/(tabs)/checkout")}
          >
            <Text className="text-white" style={{ fontSize: 20 }}>
              Checkout
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type Product = {
  image: string;
  name: string;
  price: number;
  shipping_fee: number;
};

export type CartItemT = {
  created_at: string;
  id: string;
  user_id: string;
  product_id: string;
  products: Product;
  quantity: number;
};
