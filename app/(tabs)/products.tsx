import SearchBar from "~/components/products/search-bar";
import {
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
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
    <SafeAreaView
      className="h-full"
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="p-5">
        <SearchBar />
        <View
          style={{
            marginTop: 15,
            marginBottom: 100,
          }}
        >
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(_, index) => `${index}`}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export type ProductsT = Tables<"products">;
