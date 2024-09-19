import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function Screen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="px-5">
          <Text>Product ID - {id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
