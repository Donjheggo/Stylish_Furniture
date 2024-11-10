import { supabase } from "../supabase";
import { Alert } from "react-native";
import { CreateReviewT } from "~/components/reviews/review-form";

export async function GetProductReviewsById(product_id: string) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, user_id(*)`)
      .eq("product_id", product_id)
      .order("created_at", { ascending: true });

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

export async function CreateReview(form: CreateReviewT) {
  try {
    const { error } = await supabase.from("reviews").insert(form).select();

    if (error) {
      return { error: error.message };
    }

    return { error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}
