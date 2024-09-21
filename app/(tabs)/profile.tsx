import {
  GetTotalOrders,
  GetCompletedOrders,
  GetPendingOrders,
  GetDeliveryOrders,
  GetCartItems,
} from "~/lib/actions/profile";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth-context";
import { useState, useEffect } from "react";

export default function Screen() {
  const { user } = useAuth();
  const [data, setData] = useState({
    total: 0,
    pending: 0,
    delivery: 0,
    completed: 0,
    carts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [
        totalOrders,
        totalPendingOrders,
        totalDeliveryOrders,
        totalCompletedOrders,
        totalCartItems,
      ] = await Promise.all([
        GetTotalOrders(user?.id || ""),
        GetCompletedOrders(user?.id || ""),
        GetPendingOrders(user?.id || ""),
        GetDeliveryOrders(user?.id || ""),
        GetCartItems(user?.id || ""),
      ]);
      setData({
        total: totalOrders || 0,
        pending: totalPendingOrders || 0,
        delivery: totalDeliveryOrders || 0,
        completed: totalCompletedOrders || 0,
        carts: totalCartItems || 0,
      });
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          <Text className="text-center text-2xl font-semibold">
            {user?.email}
          </Text>
          <View className="mt-5">
            <Text className="text-xl">Cart Items - {data.carts}</Text>
            <Text className="text-xl">Orders - {data.total}</Text>
            <Text className="text-xl">Completed Orders - {data.completed}</Text>
            <Text className="text-xl">Out For Delivery - {data.delivery}</Text>
            <Text className="text-xl">Pending Orders - {data.pending}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
