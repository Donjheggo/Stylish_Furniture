import { supabase } from "../supabase";
import { Alert } from "react-native";

export async function GetTotalOrders(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      Alert.alert(error.message);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return 0;
    }
  }
}

export async function GetPendingOrders(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id)
      .eq("delivery_status", "PENDING");
    if (error) {
      Alert.alert(error.message);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return 0;
    }
  }
}

export async function GetDeliveryOrders(user_id: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user_id)
        .eq("delivery_status", "OUT FOR DELIVERY");
      if (error) {
        Alert.alert(error.message);
        return 0;
      }
      return data.length || 0;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        return 0;
      }
    }
  }
  

export async function GetCompletedOrders(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id)
      .eq("delivery_status", "COMPLETED");
    if (error) {
      Alert.alert(error.message);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return 0;
    }
  }
}

export async function GetCartItems(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      Alert.alert(error.message);
      return 0;
    }
    return data.length || 0
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return 0;
    }
  }
}
