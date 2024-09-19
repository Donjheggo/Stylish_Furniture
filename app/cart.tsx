import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";

export default function Screen() {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="px-5">
          <Text>Cart Screen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
