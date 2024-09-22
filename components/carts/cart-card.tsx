import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";
import type { CartItemT } from "~/app/(tabs)/cart";
import { Plus, Minus } from "lucide-react-native";
import { IncreaseQuantity, DecreaseQuantity } from "~/lib/actions/carts";
import { useCart } from "~/context/cart-context";

export default function CartCard({ item }: { item: CartItemT }) {
  const { fetchCartData } = useCart();
  const handleIncrease = async () => {
    try {
      await IncreaseQuantity(item.id);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  const handleDecrease = async () => {
    try {
      const response = await DecreaseQuantity(item.id);
      if (response?.action === "deleted") fetchCartData();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-secondary">
      <View className="flex-row items-center flex-1">
        <Image
          source={item.products.image}
          placeholder={blurhash}
          contentFit="contain"
          style={{ width: 80, height: 80, borderRadius: 8 }}
          transition={1000}
        />
        <View className="ml-4 flex-1">
          <View className="flex-row items-center mt-2">
            <Text className="text-xl font-bold">
              ₱{item.products.price.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-md">
              ₱{item.products.shipping_fee.toLocaleString()} shipping fee
            </Text>
          </View>
          <Text className="text-lg font-semibold">{item.products.name}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="p-2 bg-secondary"
          style={{ borderRadius: 5 }}
          onPress={handleDecrease}
        >
          <Minus color="#7F5539" />
        </TouchableOpacity>
        <Text className="mx-2 text-lg">{item.quantity}</Text>
        <TouchableOpacity
          className="p-2 bg-secondary"
          style={{ borderRadius: 5 }}
          onPress={handleIncrease}
        >
          <Plus color="#7F5539" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
