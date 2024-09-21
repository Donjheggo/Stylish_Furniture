import { View, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { OrdersT } from "~/app/(tabs)/orders";
import { Link } from "expo-router";

export default function OrderCard({ item }: { item: OrdersT }) {
  return (
    <Link
      href={{ pathname: "/(tabs)/order/[id]", params: { id: item.id } }}
      asChild
    >
      <TouchableOpacity>
        <View className="mt-2 only:flex-row items-center justify-between p-4 border-b border-gray-200">
          <View className="flex-row items-center flex-1">
            <View className="ml-4 flex-1">
              <View className="flex-row justify-between items-center mt-2">
                <View>
                  <Text className="text-xl">Order Placed: </Text>
                </View>
                <View>
                  <Text className="text-xl">
                    {new Date(item.created_at).toDateString()}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <View>
                  <Text className="text-xl">Payment Method: </Text>
                </View>
                <View>
                  <Text className="text-xl">{item.payment_method}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <View>
                  <Text className="text-xl">Delivery Status: </Text>
                </View>
                <View>
                  <Text className="text-xl">{item.delivery_status}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <View>
                  <Text className="text-xl">Delivery Schedule: </Text>
                </View>
                <View>
                  <Text className="text-xl">
                    {item.delivery_schedule ?? (
                      <Text className="text-xl">TBD</Text>
                    )}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <View>
                  <Text className="text-xl">Total Payable:</Text>
                </View>
                <View>
                  <Text className="text-xl font-bold">
                    ₱{item.total_payable.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
