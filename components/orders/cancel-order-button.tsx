import { Ban } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "../ui/text";
import { CancelOrder } from "~/lib/actions/orders";

export default function CancelOrderButton({ id }: { id: string }) {
  const router = useRouter();

  const handleCancelOrder = async () => {
    await CancelOrder(id);
    router.replace("/(tabs)/products");
  };

  return (
    <Pressable
      onPress={handleCancelOrder}
      className="flex flex-row items-center gap-2 p-2"
    >
      <Ban color="#B08968" size={23} />
      <Text className="text-red-400 text-2xl">Cancel</Text>
    </Pressable>
  );
}
