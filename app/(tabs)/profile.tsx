import {
  GetCompletedOrders,
  GetPendingOrders,
  GetDeliveryOrders,
  GetCartItems,
} from "~/lib/actions/profile";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth-context";
import { useState } from "react";
import ProfileCard from "~/components/profile/profile-cards";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function Screen() {
  const { user } = useAuth();
  const [data, setData] = useState({
    pending: 0,
    delivery: 0,
    completed: 0,
    carts: 0,
  });

  const fetchData = async () => {
    const [
      totalPendingOrders,
      totalDeliveryOrders,
      totalCompletedOrders,
      totalCartItems,
    ] = await Promise.all([
      GetCompletedOrders(user?.id || ""),
      GetPendingOrders(user?.id || ""),
      GetDeliveryOrders(user?.id || ""),
      GetCartItems(user?.id || ""),
    ]);
    setData({
      pending: totalPendingOrders || 0,
      delivery: totalDeliveryOrders || 0,
      completed: totalCompletedOrders || 0,
      carts: totalCartItems || 0,
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          <Text className="text-center text-3xl font-semibold">
            {user?.email}
          </Text>
          <View className="mt-5">
            <ProfileCard name="Cart Items" number={data.carts} />
            <ProfileCard name="Pending Orders" number={data.pending} />
            <ProfileCard name="Out For Delivery" number={data.delivery} />
            <ProfileCard name="Completed Orders" number={data.completed} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
