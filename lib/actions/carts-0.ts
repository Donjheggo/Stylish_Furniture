import { Alert } from "react-native";
import { supabase } from "../supabase";

export type CartFormT = {
  user_id: string;
  product_id: string;
  quantity: number;
};

export async function CartForm(form: CartFormT) {
  try {
    // Check if the product already exists in the cart for this owner
    const { data, error: checkError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", form.user_id)
      .eq("product_id", form.product_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Return error if it's not related to no records found
      Alert.alert(checkError.message);
      return undefined;
    }

    if (data) {
      // Product already in cart, so update the quantity
      const newQuantity = data.quantity + form.quantity;
      const { error: updateError } = await supabase
        .from("carts")
        .update({ quantity: newQuantity })
        .eq("user_id", form.user_id)
        .eq("product_id", form.product_id);

      if (updateError) {
        Alert.alert(updateError.message);
        return false;
      }
    } else {
      // Product not in cart, so insert a new record
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

export async function GetCarts(id: string) {
  try {
    const { data, error } = await supabase
      .from("carts")
      .select(`*, products:product_id ( name, image, price, shipping )`)
      .eq("user_id", id)
      .order("created_at", { ascending: false });

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

type CartData = {
  quantity: number;
  product_id: string;
  products: {
    quantity: number;
  }[];
};

export async function IncreaseQuantity(id: string) {
  try {
    // Fetch both cart item and associated product data
    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .select(`
        quantity,
        product_id,
        products (
          quantity
        )
      `)
      .eq("id", id)
      .single();

    if (cartError) {
      Alert.alert("Error fetching cart data", cartError.message);
      return undefined;
    }

    if (!cartData || !cartData.products || cartData.products.length === 0) {
      Alert.alert("Error", "Cart item or product not found");
      return undefined;
    }

    // Type assertion to help TypeScript understand the structure
    const typedCartData = cartData as CartData;

    const currentCartQuantity = typedCartData.quantity;
    const availableProductQuantity = typedCartData.quantity;

    // Check if we've reached the limit
    if (currentCartQuantity >= availableProductQuantity) {
      Alert.alert(
        "Maximum quantity reached",
        "No more items available in stock."
      );
      return { action: "limit_reached", quantity: currentCartQuantity };
    }

    // Increment the quantity
    const newQuantity = currentCartQuantity + 1;

    // Update the quantity
    const { error: updateError } = await supabase
      .from("carts")
      .update({ quantity: newQuantity })
      .eq("id", id);

    if (updateError) {
      Alert.alert("Error updating quantity", updateError.message);
      return undefined;
    }

    return { action: "updated", newQuantity };
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert("Unexpected error", error.message);
    } else {
      Alert.alert("An unexpected error occurred");
    }
    return undefined;
  }
}


export async function DecreaseQuantity(id: string) {
  try {
    const { data, error: fetchError } = await supabase
      .from("carts")
      .select("quantity")
      .eq("id", id)
      .single();

    if (fetchError) {
      Alert.alert("Error fetching quantity", fetchError.message);
      return undefined;
    }

    if (!data) {
      Alert.alert("Error", "Cart item not found");
      return undefined;
    }

    const currentQuantity = data.quantity;

    if (currentQuantity === 1) {
      const { error: deleteError } = await supabase
        .from("carts")
        .delete()
        .eq("id", id);

      if (deleteError) {
        Alert.alert("Error deleting item", deleteError.message);
        return undefined;
      }

      return { action: 'deleted' };
    }

    const newQuantity = currentQuantity - 1;

    const { error: updateError } = await supabase
      .from("carts")
      .update({ quantity: newQuantity })
      .eq("id", id);

    if (updateError) {
      Alert.alert("Error updating quantity", updateError.message);
      return undefined;
    }

    return { action: 'updated', newQuantity };
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert("Unexpected error", error.message);
    } else {
      Alert.alert("An unexpected error occurred");
    }
    return undefined;
  }
}
