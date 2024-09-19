import { Tabs, Redirect } from "expo-router";
import {
  Home,
  Package,
  Armchair,
  ShoppingCart,
  User,
  MessageSquareMore,
} from "lucide-react-native";
import { useAuth } from "~/context/auth-context";

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7F5539",
        tabBarInactiveTintColor: "#B08968",
        headerShown: false,
        headerTitleStyle: {
          fontSize: 20,
          color: "#9C6644",
        },
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color }) => <Armchair size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <Package size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <MessageSquareMore size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
