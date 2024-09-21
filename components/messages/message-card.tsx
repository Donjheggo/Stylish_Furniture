import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth-context";
import { FormatDateTimeAgo } from "~/lib/utils";

export default function MessageCard({
  message,
  created_at,
  sender_id,
}: {
  message: string;
  created_at: string;
  sender_id: string;
}) {
  const { user } = useAuth();
  const card_class = user?.id === sender_id ? "bg-primary ml-auto" : "mr-auto";

  return (
    <View
      className={`mt-2 border border-primary ${card_class} rounded-lg p-2 w-3/4`}
    >
      <Text className="text-xl "> {message}</Text>
      <Text className="pt-2 text-card-foreground">
        {" "}
        {FormatDateTimeAgo(new Date(created_at))}
      </Text>
    </View>
  );
}
