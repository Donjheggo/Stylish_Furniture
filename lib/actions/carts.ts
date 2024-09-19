import { Alert } from "react-native";
import { supabase } from "../supabase";

export type CartFormT = {
  owner_id: string;
  product_id: string;
  quantity: number;
};

export async function CartForm(form: CartFormT) {
  try {
    const { data, error: checkError } = await supabase
      .from("carts")
      .select("*")
      .eq("owner_id", form.owner_id)
      .eq("product_id", form.product_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      Alert.alert(checkError.message);
      return false;
    }

    if (data) {
      const newQuantity = data.quantity + form.quantity;
      const { error: updateError } = await supabase
        .from("carts")
        .update({ quantity: newQuantity })
        .eq("owner_id", form.owner_id)
        .eq("product_id", form.product_id);

      if (updateError) {
        Alert.alert(updateError.message);
        return false;
      }
    } else {
      const { error: insertError } = await supabase.from("carts").insert(form);

      if (insertError) {
        Alert.alert(insertError.message);
        return false;
      }
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return false;
    }
  }
}
