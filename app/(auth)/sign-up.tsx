import { useState } from "react";
import { View, Alert } from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Eye, EyeOff } from "lucide-react-native";
import { supabase } from "~/lib/supabase";
import { Link, router } from "expo-router";

const SignUp = () => {
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    setLoading(false);
    if (error) Alert.alert(error.message);
    if (session) router.replace("/home");
  }

  return (
    <View className="w-full flex flex-col gap-3">
      <Text className="text-center font-semibold text-2xl text-secondary">
        Create an Account
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
        onPress={signUpWithEmail}
        variant="default"
        className="mt-2"
        disabled={isLoading}
      >
        <Text className="text-white">Create Account</Text>
      </Button>
      <Text className="dark:text-secondary">
        Already have an account?
        <Link href="/sign-in" className="text-primary-foreground">
          {" "}
          Sign in
        </Link>
      </Text>
    </View>
  );
};

export default SignUp;
