import { Image, View } from "react-native";
import { Text } from "../ui/text";
import type { ProductsT } from "~/app/(tabs)/products";

export default function ProductCard({ item }: { item: ProductsT }) {
  return (
    <View style={{ width: "49%" }}>
      <Image
        source={{
          uri: item.image!,
        }}
        className="rounded-lg"
        style={{ width: "100%", height: 175 }}
      />

      <Text className="text-xl" style={{ fontWeight: "bold" }}>
        ₱ {item.price}
      </Text>
      <Text className="text-xl">{item.name}</Text>
    </View>
  );
}
