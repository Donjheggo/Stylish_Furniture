import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";
import type { ProductsT } from "~/app/(tabs)/products";
import { Link } from "expo-router";

export default function ProductCard({ item }: { item: ProductsT }) {
  return (
    <View style={{ width: "49%" }}>
      <Link
        href={{ pathname: "/(tabs)/product/[id]", params: { id: item.id } }}
        asChild
      >
        <TouchableOpacity>
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
        </TouchableOpacity>
      </Link>
    </View>
  );
}
