import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";
import type { ProductsT } from "~/app/(tabs)/products";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";

export default function ProductCard({ item }: { item: ProductsT }) {
  return (
    <View style={{ width: "49%" }}>
      <Link
        href={{ pathname: "/(tabs)/product/[id]", params: { id: item.id } }}
        asChild
      >
        <TouchableOpacity>
          <Image
            source={item.image}
            placeholder={{ blurhash }}
            contentFit="cover"
            style={{ height: 175, borderRadius: 10 }}
            transition={1000}
          />

          <Text className="text-xl" style={{ fontWeight: "bold" }}>
            ₱{item.price.toLocaleString()}
          </Text>
          <Text className="text-xl">{item.name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
