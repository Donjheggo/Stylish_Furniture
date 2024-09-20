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
  //   const [product, setProduct] = useState<ProductsT>();

  useEffect(() => {
    // const fetchProduct = async () => {
    //   const product = await GetProductById(id as string);
    //   setProduct(product);
    // };
    // fetchProduct();
  }, [id]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          <Text>{id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
