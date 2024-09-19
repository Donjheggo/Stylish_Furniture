import { View, Image, SafeAreaView, ScrollView, AppState } from "react-native";
import { supabase } from "~/lib/supabase";
import { router, Slot } from "expo-router";
import { useAuth } from "~/context/auth-context";
import { useEffect } from "react";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const AuthLayout = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/products");
    }
  }, [user]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="mt-10 flex justify-center items-center gap-5 p-6">
          <Slot />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
