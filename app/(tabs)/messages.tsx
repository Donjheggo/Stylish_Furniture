import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import MessageCard from "~/components/messages/message-card";
import MessageForm from "~/components/messages/message-form";
import { useEffect, useState } from "react";
import { useAuth } from "~/context/auth-context";
import { GetMessages } from "~/lib/actions/message";
import { Tables } from "~/database.types";
import { supabase } from "~/lib/supabase";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";
import { useRef } from "react";

const messages_per_page = 10;

export default function Screen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessagesT[]>([]);
  const [page, setPage] = useState<number>(1);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async (pageNumber: number) => {
    const data = await GetMessages(
      user?.id || "",
      pageNumber,
      messages_per_page
    );
    if (data) {
      setMessages((prevMessages) => {
        const newMessages = data.filter(
          (newMsg) => !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id)
        );
        return pageNumber === 1
          ? [...newMessages]
          : [...prevMessages, ...newMessages];
      });
    }
  };
  useEffect(() => {
    fetchMessages(1);

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${user?.id}${process.env.EXPO_PUBLIC_ADMIN_ID}`,
        },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as MessagesT,
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const loadMoreMessages = () => {
    setPage((prevPage) => prevPage + 1);
    fetchMessages(page + 1);
  };


  const renderMessage = ({ item }: { item: MessagesT }) => (
    <MessageCard
      sender_id={item.sender_id}
      message={item.message}
      created_at={item.created_at}
    />
  );

  return (
    <SafeAreaView className="h-full">
      <View className="border-b border-primary flex-row items-center px-5 py-2 gap-2">
        <Image
          source={require("~/assets/images/icon.png")}
          style={{ width: 40, height: 40, borderRadius: 8 }}
          placeholder={blurhash}
          transition={1000}
        />
        <Text className="text-xl">Support & Inquiries</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          inverted
          contentContainerStyle={{
            flexDirection: "column-reverse",
            padding: 20,
          }}
        />

        <MessageForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export type MessageT = {
  sender_id: string;
  message: string;
};

export type MessagesT = Tables<"messages">;
