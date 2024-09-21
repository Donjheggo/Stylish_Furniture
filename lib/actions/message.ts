import { Alert } from "react-native";
import { supabase } from "../supabase";
import { MessageT } from "~/app/(tabs)/messages";

export async function SendMessage(form: MessageT) {
  try {
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: form.sender_id,
          receiver_id: process.env.EXPO_PUBLIC_ADMIN_ID || "",
          message: form.message,
          conversation_id: `${form.sender_id}${process.env.EXPO_PUBLIC_ADMIN_ID}`,
        },
      ])
      .select();
    if (error) {
      Alert.alert(error.message);
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return false;
    }
  }
}

export async function GetMessages(
  user_id: string,
  page: number,
  limit: number
) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
      .order("created_at", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

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
