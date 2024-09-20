import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";
import { Alert } from "react-native";
import { GetMyOrderById } from "~/lib/actions/orders";

export default function Screen() {
  const { id } = useLocalSearchParams();
  const [orders, setOrders] = useState<OrderT[]>();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await GetMyOrderById(id as string);
        setOrders(order);
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
          return [];
        }
      }
    };

    fetchOrder();
  }, [id]);

  console.log(orders);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          {orders?.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200"
            >
              <View className="flex-row items-center flex-1">
                <Image
                  source={item.product_id.image}
                  placeholder={blurhash}
                  contentFit="contain"
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                  transition={1000}
                />
                <View className="ml-4 flex-1">
                  <View className="flex-row items-center mt-2">
                    <Text className="text-xl font-bold">
                      ₱ {item.product_id.price.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-md">
                      ₱ {item.product_id.shipping_fee.toLocaleString()} shipping
                      fee
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold">
                    {item.product_id.name}
                  </Text>
                </View>
                <View>
                  <Text>X{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ProductT = {
  image: string;
  name: string;
  price: number;
  shipping_fee: number;
};

type OrderT = {
  created_at: Date;
  id: string;
  order_id: string;
  price: number;
  product_id: ProductT;
  quantity: number;
  shipping_fee: number;
};
