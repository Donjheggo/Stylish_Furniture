import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";
import type { CartItemT } from "~/app/(tabs)/cart";
import { Plus, Minus } from "lucide-react-native";
import { IncreaseQuantity, DecreaseQuantity } from "~/lib/actions/carts";

export default function CartCard({ item }: { item: CartItemT }) {
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
      await DecreaseQuantity(item.id);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
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
              ₱ {item.products.price.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-md">
              ₱ {item.products.shipping.toLocaleString()} shipping fee
            </Text>
          </View>
          <Text className="text-lg font-semibold">{item.products.name}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="p-2 bg-card"
          style={{ borderRadius: 5 }}
          onPress={handleDecrease}
        >
          <Minus color="#7F5539" />
        </TouchableOpacity>
        <Text className="mx-2 text-lg">{item.quantity}</Text>
        <TouchableOpacity
          className="p-2 bg-card"
          style={{ borderRadius: 5 }}
          onPress={handleIncrease}
        >
          <Plus color="#7F5539" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
