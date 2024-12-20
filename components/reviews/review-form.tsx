import { View, TextInput } from "react-native";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { SendHorizonal } from "lucide-react-native";
import { useRef } from "react";
import { Alert } from "react-native";
import { CreateReview } from "~/lib/actions/reviews";
import { useAuth } from "~/context/auth-context";

export default function ReviewForm({ product_id }: { product_id: string }) {
  const { user } = useAuth();
  const [textInputHeight, setTextInputHeight] = useState<number>(0);
  const textInputRef = useRef<TextInput>(null);
  const [form, setForm] = useState<CreateReviewT>({
    product_id: product_id,
    user_id: user?.id || "",
    message: "",
  });

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(35, height), 5 * 35); // Assuming 35 is the height of a single line
    setTextInputHeight(newHeight);
  };

  const handleSubmit = async () => {
    const trimmedContent = form.message.trim();
    if (!trimmedContent) {
      return;
    }
    try {
      const response = await CreateReview(form);
      if (!response) {
        return;
      }
      setForm({ ...form, message: "" });
      return;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        return;
      }
    }
  };

  return (
    <View className="py-5 flex-row">
      <TextInput
        ref={textInputRef}
        multiline
        placeholder="Type a review message..."
        className="flex-1 border border-primary rounded-md px-3 py-2 text-primary-foreground dark:text-primary"
        value={form.message}
        onChangeText={(e) => setForm({ ...form, message: e })}
        onContentSizeChange={handleContentSizeChange}
        style={{ height: Math.max(35, textInputHeight) }}
      />
      <Button
        onPress={handleSubmit}
        size="icon"
        variant="outline"
        className="ml-2 mt-auto border-0 bg-transparent"
      >
        <SendHorizonal color="#B08968" size={30} />
      </Button>
    </View>
  );
}

export type CreateReviewT = {
  product_id: string;
  user_id: string;
  message: string;
};
