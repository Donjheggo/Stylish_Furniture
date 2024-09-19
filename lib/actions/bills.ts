import { supabase } from "../supabase";
import { Alert } from "react-native";

export async function SearchBill(searchQuery: string) {
  try {
    if (!searchQuery) {
      return [];
    }

    let { data: bills, error } = await supabase
      .from("bills")
      .select("*")
      .textSearch("name", `'${searchQuery}'`);

    if (error) {
      Alert.alert(error.message);
      return [];
    }
    return bills;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return [];
    }
  }
}

export async function GetBills() {
  try {
    const { data, error } = await supabase.from("bills").select("*");

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
