import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import type { ProductsT } from "../products";
import { GetProductById } from "~/lib/actions/products";
import { GetProductReviewsById } from "~/lib/actions/reviews";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ShoppingCart } from "lucide-react-native";
import { Alert } from "react-native";
import { CartForm } from "~/lib/actions/carts";
import { useAuth } from "~/context/auth-context";
import { Tables } from "~/database.types";
import ReviewForm from "~/components/reviews/review-form";
import { supabase } from "~/lib/supabase";

export default function Screen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductsT>();
  const [reviews, setReviews] = useState<ReviewsT[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await GetProductById(id as string);
      if (product) setProduct(product);
    };

    fetchProduct();
  }, [id]);

  const fetchReviews = async () => {
    const reviews = await GetProductReviewsById(id as string);
    if (reviews) setReviews(reviews);
  };

  useEffect(() => {
    fetchReviews();

    const subscription = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        fetchReviews
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
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
                ₱{product?.price.toLocaleString()}
              </Text>
              <Text className="text-2xl" style={{ fontWeight: "semibold" }}>
                {product?.name}
              </Text>
              <Text className="text-lg text-muted-foreground">
                Stock: {product?.quantity}
              </Text>
              <Text className="text-lg text-muted-foreground">
                Shipping: ₱{product?.shipping_fee}
              </Text>
              <Text className="text-xl mt-5">{product?.description}</Text>
            </View>
            <Button
              onPress={addToCart}
              size="lg"
              className="mt-5 flex flex-row"
            >
              <ShoppingCart color="#fff" style={{ marginRight: 10 }} />
              <Text className="text-white" style={{ fontSize: 20 }}>
                Add to cart
              </Text>
            </Button>
            <View className="mt-5">
              <ReviewForm product_id={id as string} />

              <Text className="font-bold">Reviews:</Text>
              {reviews.map((item, index) => (
                <View key={index} className="flex flex-row flex-wrap">
                  <Text>{item.user_id.email}: </Text>
                  <Text className="font-light">{item.message}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type UserT = Tables<"users">;
export type ReviewsT = {
  created_at: string;
  id: string;
  message: string;
  product_id: string;
  user_id: UserT;
};
