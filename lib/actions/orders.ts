import { supabase } from "../supabase";
import { Alert } from "react-native";

export async function GetMyOrders(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      Alert.alert(error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return [];
    }
  }
}

export async function GetMyOrderById(order_id: string) {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select(`*, product_id (name, price, image, shipping_fee)

        `)
      .eq("order_id", order_id);

    if (error) {
      Alert.alert(error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return [];
    }
  }
}
