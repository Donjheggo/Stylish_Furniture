import { supabase } from "~/lib/supabase";
import { LogOut } from "lucide-react-native";
import { Button } from "../ui/button";
import { Text } from "~/components/ui/text";

export default function SignoutButton() {
  const handleSignout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Button
      size="lg"
      onPress={handleSignout}
      className="w-full border border-primary mt-5 rounded-lg flex-row items-center"
    >
      <LogOut size={30} color="#7F5539" />
      <Text className="ml-2" style={{ fontSize: 20 }}>
        Signout
      </Text>
    </Button>
  );
}
