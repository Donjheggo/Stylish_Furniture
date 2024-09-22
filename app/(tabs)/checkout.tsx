import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "~/context/auth-context";
import { Alert } from "react-native";
import { Checkout, type CheckoutT } from "~/lib/actions/checkout";
import { GetTotalShippingAndTotalPrice } from "~/lib/actions/checkout";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GetGcashNumber } from "~/lib/actions/checkout";
import { Tables } from "~/database.types";
import { useCart } from "~/context/cart-context";

export type GcashNumberT = Tables<"gcash_number_payment">;

const payment_methods = ["COD", "GCASH"];

export default function Screen() {
  const { fetchCartData } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const [gcashNumber, setGcashNumber] = useState<GcashNumberT[]>([]);
  const [prices, setPrices] = useState({
    totalPrice: 0,
    totalShipping: 0,
    totalPayable: 0,
  });
  const [form, setForm] = useState<CheckoutT>({
    user_id: user?.id || "",
    name: "",
    address: "",
    contact_number: "",
    payment_method: null,
    gcash_reference_number: "",
  });

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 5,
    right: 12,
  };

  const handleSubmit = async () => {
    try {
      const success = await Checkout(form);
      if (success) {
        setForm({
          user_id: user?.id || "",
          name: "",
          address: "",
          contact_number: "",
          payment_method: null,
          gcash_reference_number: "",
        });
        setPrices({
          totalPrice: 0,
          totalShipping: 0,
          totalPayable: 0,
        });
        fetchCartData()
        router.push("/(tabs)/orders");
        return success;
      } else {
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await GetTotalShippingAndTotalPrice(user?.id || "");
      setPrices({
        totalPrice: data?.totalPrice || 0,
        totalShipping: data?.totalShippingFee || 0,
        totalPayable: data?.totalPayable || 0,
      });
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchGcashNumber = async () => {
      const number = await GetGcashNumber();
      if (number) {
        setGcashNumber(number || []);
      }
    };

    fetchGcashNumber();
  }, []);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-5">
          <Text className="text-center font-semibold text-2xl">Checkout</Text>
          <View>
            <Label nativeID="name" className="pb-1">
              Full name:
            </Label>
            <Input
              placeholder="Firstname Lastname"
              value={form.name}
              onChangeText={(e) => setForm({ ...form, name: e })}
              aria-labelledby="Name"
              aria-errormessage="inputError"
              keyboardType="default"
            />
          </View>
          <View>
            <Label nativeID="address" className="pb-1">
              Full address:
            </Label>
            <Input
              placeholder="Complete Address for the delivery"
              value={form.address}
              onChangeText={(e) => setForm({ ...form, address: e })}
              aria-labelledby="address"
              aria-errormessage="inputError"
              keyboardType="default"
            />
          </View>
          <View>
            <Label nativeID="contact_number" className="pb-1">
              Contact Number:
            </Label>
            <Input
              placeholder="09........."
              value={form.contact_number.toString()}
              onChangeText={(e) => setForm({ ...form, contact_number: e })}
              aria-labelledby="contact_number"
              aria-errormessage="inputError"
              keyboardType="default"
            />
          </View>
          <Label nativeID="payment_method" className="pb-1">
            Payment Method
          </Label>
          <Select
            defaultValue={{ value: "", label: "Select Payment Method" }}
            onValueChange={(value) =>
              setForm({
                ...form,
                payment_method: value?.value as "COD" | "GCASH" | null,
              })
            }
          >
            <SelectTrigger>
              <SelectValue
                className="text-foreground dark:text-white text-sm native:text-lg"
                placeholder="Select a billing number"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets}>
              <SelectGroup>
                {payment_methods.map((item, index) => (
                  <SelectItem key={index} label={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.payment_method === "GCASH" && (
            <View>
              <Text>
                Send GCASH amount to this number and input the reference
                number/s below.{" "}
              </Text>
              {gcashNumber.map((item, index) => (
                <Text className="text-xl font-semibold" key={index}>
                  {item.number}
                </Text>
              ))}

              <Label nativeID="gcash_reference_number" className="pb-1">
                GCASH Reference Number:
              </Label>
              <Input
                placeholder="00000000000000"
                value={form.gcash_reference_number}
                onChangeText={(e) =>
                  setForm({ ...form, gcash_reference_number: e })
                }
                aria-labelledby="contact_number"
                aria-errormessage="inputError"
                keyboardType="default"
              />
            </View>
          )}
          <View className="mt-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text>Price:</Text>
              </View>
              <View>
                <Text>₱ {prices.totalPrice.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text>Total Shipping:</Text>
              </View>
              <View>
                <Text>₱ {prices.totalShipping.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text>Total Payable:</Text>
              </View>
              <View>
                <Text className="text-2xl font-semibold">
                  ₱ {prices.totalPayable.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          <Button size="lg" className="mt-5" onPress={handleSubmit}>
            <Text style={{ fontSize: 20 }} className="text-white">
              Submit Order{" "}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
