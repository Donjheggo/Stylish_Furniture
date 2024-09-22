import { ShoppingCart } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { Text } from "./ui/text";
import { useCart } from "~/context/cart-context";

export default function ShoppingCartIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  const { cartTotal } = useCart();

  return (
    <View style={styles.container}>
      <ShoppingCart size={size} color={color} />
      {cartTotal > 0 && (
        <View style={styles.badgeContainer} className="rounded-full">
          <Text className="text-muted-foreground text-lg font-semibold">
            {cartTotal}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    right: -12,
    top: -10,
  },
});
