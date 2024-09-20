import SearchBar from "~/components/products/search-bar";
import { View, SafeAreaView, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { Tables } from "~/database.types";
import { SearchProducts } from "~/lib/actions/products";
import { useLocalSearchParams } from "expo-router";
import ProductCard from "~/components/products/product-card";

export default function Screen() {
  const { query } = useLocalSearchParams();
  const [products, setProducts] = useState<ProductsT[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await SearchProducts(query as string);
      setProducts(data ?? []);
    };
    fetchProducts();
  }, [query]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          <SearchBar />
          <View
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
            className="gap-2 mt-5"
          >
            {products?.map((item, index) => (
              <ProductCard item={item} key={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export type ProductsT = Tables<"products">;
