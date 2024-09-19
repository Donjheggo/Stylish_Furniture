import { Alert } from "react-native";
import { supabase } from "../supabase";
import type { PaymentFormT } from "~/components/payment/payment-form";

export async function SendPayment(form: PaymentFormT) {
  try {
    const { error } = await supabase.from("payments").insert(form).select();

    if (error) {
      Alert.alert(error.message);
    }
    return;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}

export async function GetPayments(id: string) {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("owner_id", id);
    if (error) {
      Alert.alert(error.message);
      return [];
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return [];
    }
  }
}
