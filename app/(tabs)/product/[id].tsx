import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import type { ProductsT } from "../products";
import { GetProductById } from "~/lib/actions/products";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ShoppingCart } from "lucide-react-native";
import { Alert } from "react-native";
import { CartForm } from "~/lib/actions/carts";
import { useAuth } from "~/context/auth-context";

export default function Screen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductsT>();

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await GetProductById(id as string);
      setProduct(product);
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const success = await CartForm({
        user_id: user?.id || "",
        product_id: id as string,
        quantity: 1,
      });
      if (!success) Alert.alert("Failed to add");
      else Alert.alert("Added to cart.");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          {product?.image && (
            <Image
              placeholder={{ blurhash }}
              source={product?.image}
              style={{ borderRadius: 10, height: 360 }}
              contentFit="cover"
              transition={1000}
            />
          )}
          <View className="mt-2">
            <Text className="text-3xl font-semibold">
              ₱ {product?.price.toLocaleString()}
            </Text>
            <Text className="text-2xl" style={{ fontWeight: "semibold" }}>
              {product?.name}
            </Text>
            <Text className="text-lg text-muted-foreground">
              Stock: {product?.quantity}
            </Text>
            <Text className="text-xl mt-5">{product?.description}</Text>
          </View>
          <Button onPress={addToCart} size="lg" className="mt-5 flex flex-row">
            <ShoppingCart color="#fff" style={{ marginRight: 10 }} />
            <Text className="text-white" style={{ fontSize: 20 }}>
              Add to cart
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
