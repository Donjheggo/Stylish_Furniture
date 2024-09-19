import { supabase } from "../supabase";
import { Alert } from "react-native";

export async function SearchProducts(searchQuery: string) {
  try {
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = searchQuery
      ? await query.textSearch("name", `'${searchQuery}'`)
      : await query;

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

export async function GetProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      Alert.alert(error.message);
      return undefined;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return undefined;
    }
  }
}
