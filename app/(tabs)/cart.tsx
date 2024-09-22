import { View, SafeAreaView, ScrollView } from "react-native";
import CartCard from "~/components/carts/cart-card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { useCart } from "~/context/cart-context";

export default function Screen() {
  const router = useRouter();
  const { carts, prices } = useCart();

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
                <Text>₱{prices.totalPrice.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between flex-1">
              <View>
                <Text>Total Shipping:</Text>
              </View>
              <View>
                <Text>₱{prices.totalShipping.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between flex-1">
              <View>
                <Text>Total Payable:</Text>
              </View>
              <View>
                <Text className="text-2xl font-semibold">
                  ₱{prices.totalPayable.toLocaleString()}
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
