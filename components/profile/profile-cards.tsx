import { View } from "react-native";
import { Text } from "../ui/text";

export default function ProfileCard({
  name,
  number,
}: {
  name: string;
  number: number;
}) {
  return (
    <View className="w-full border border-primary mt-5 rounded-lg">
      <Text className="text-5xl font-semibold text-center p-2">{number}</Text>
      <Text className="text-2xl text-center p-2">{name}</Text>
    </View>
  );
}
