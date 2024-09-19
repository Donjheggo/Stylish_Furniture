import { supabase } from "../supabase";
import { Alert } from "react-native";

export async function GetClients() {
    try {
      const { data, error } = await supabase.from("clients").select("*");
  
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
  