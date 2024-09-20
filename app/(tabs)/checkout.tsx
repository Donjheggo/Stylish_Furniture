import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "~/context/auth-context";
import { Alert } from "react-native";
import { Checkout, type CheckoutT } from "~/lib/actions/checkout";
import { GetTotalShippingAndTotalPrice } from "~/lib/actions/checkout";

export default function Screen() {
  const { user } = useAuth();
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
  });

  const handleSubmit = async () => {
    try {
      await Checkout(form);
      setPrices({ totalPrice: 0, totalShipping: 0, totalPayable: 0 });
      Alert.alert("Success")
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

  return (
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
  );
}
