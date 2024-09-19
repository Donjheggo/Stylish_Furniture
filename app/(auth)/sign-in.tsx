import { useState } from "react";
import { View, Alert } from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Eye, EyeOff } from "lucide-react-native";
import { Link } from "expo-router";
import { supabase } from "~/lib/supabase";

const SignIn = () => {
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View className="w-full flex flex-col gap-3">
      <Text className="text-center font-semibold text-2xl text-secondary">
        Sign in
      </Text>
      <View>
        <Label nativeID="email" className="pb-1">
          Email
        </Label>
        <Input
          placeholder="johndoe@email.com"
          value={form.email}
          onChangeText={(e) => setForm({ ...form, email: e })}
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
          keyboardType="email-address"
        />
      </View>
      <View>
        <Label nativeID="password" className="pb-1">
          Password
        </Label>
        <View className="relative">
          <Input
            placeholder="Password"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
            secureTextEntry={!showPassword}
          />
          <Button
            onPress={() => setShowPassword(!showPassword)}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1"
          >
            {showPassword ? (
              <EyeOff color="#B08968" />
            ) : (
              <Eye color="#B08968" />
            )}
          </Button>
        </View>
      </View>
      <Button
        size="lg"
        disabled={isLoading}
        onPress={signInWithEmail}
        variant="default"
        className="text-white mt-2"
      >
        <Text>Sign in</Text>
      </Button>
      <Text className="dark:text-secondary">
        Don't have an account?
        <Link href="/sign-up" className="text-primary-foreground">
          {" "}
          Sign up
        </Link>
      </Text>
    </View>
  );
};

export default SignIn;
