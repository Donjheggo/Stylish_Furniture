import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import OrderCard from "~/components/orders/order-card";
import { GetMyOrders } from "~/lib/actions/orders";
import { useState } from "react";
import { useAuth } from "~/context/auth-context";
import { Tables } from "~/database.types";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Screen() {
  const { user } = useAuth();
  const [data, setData] = useState<OrdersT[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        const data = await GetMyOrders(user?.id || "");
        if (!data) {
          return;
        }
        setData(data);
      };

      fetchOrders();
    }, [])
  );


  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          <Text className="text-2xl text-center font-semibold">My Orders</Text>
          {data?.map((item, index) => (
            <OrderCard item={item} key={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export type OrdersT = Tables<"orders">;
