import { ShoppingCart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function ShoppingCartButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push("/cart")}>
      <ShoppingCart color="#B08968" />
    </Pressable>
  );
}
