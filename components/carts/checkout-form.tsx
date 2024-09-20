import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
  import { View, Alert } from "react-native";
  import { useEffect, useState } from "react";
  import { Text } from "~/components/ui/text";
  import { Input } from "~/components/ui/input";
  import { Label } from "~/components/ui/label";
  import { Button } from "~/components/ui/button";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { useAuth } from "~/context/auth-context";
  import { supabase } from "~/lib/supabase";
  import { router } from "expo-router";
  import { Tables } from "~/database.types";
  import { GetClients } from "~/lib/actions/clients";
  import { GetBills } from "~/lib/actions/bills";
  import { SendPayment } from "~/lib/actions/payment";
  
  export default function CheckoutForm() {
    const { user } = useAuth();
    const [data, setData] = useState<any>({
      clients: [],
      bills: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState<any>({
      owner_id: user?.id || "",
      owner_email: user?.email || "",
      billing_number: "",
      client_name: "",
      amount: 0,
      gcash_ref_no: 0,
    });
  
    const insets = useSafeAreaInsets();
    const contentInsets = {
      top: insets.top,
      bottom: insets.bottom,
      left: 5,
      right: 12,
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [clients, bills] = await Promise.all([GetClients(), GetBills()]);
  
          setData({
            clients: clients ?? [],
            bills: bills ?? [],
          });
        } catch (error) {
          if (error instanceof Error) Alert.alert(error.message);
        }
      };
  
      fetchData();
    }, []);
  
    const handleSubmit = async () => {
    //   if (
    //     !form.client_name ||
    //     !form.billing_number ||
    //     !form.amount ||
    //     !form.gcash_ref_no
    //   ) {
    //     Alert.alert(JSON.stringify(form));
    //     Alert.alert("Please fill out all fields.");
    //     return;
    //   }
    //   1;
    //   setLoading(true);
    //   try {
    //     await SendPayment(form);
    //     Alert.alert("Success");
    //     router.push("/payment-history");
    //   } catch (error) {
    //     if (error instanceof Error) Alert.alert(error.message);
    //   } finally {
    //     setLoading(false);
    //   }
    };
  
    return (
      <>
        <View>
          <Label nativeID="billing_number" className="pb-1">
            Billing Number
          </Label>
          <Select
            defaultValue={{ value: "", label: "" }}
            onValueChange={(value) =>
              setForm({ ...form, billing_number: value?.value || "" })
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
                {data?.bills?.map((item, index) => (
                  <SelectItem
                    key={index}
                    label={item.billing_number}
                    value={item.billing_number}
                  >
                    {item.billing_number}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
  
        <View>
          <Label nativeID="client" className="pb-1">
            Client Name
          </Label>
          <Select
            defaultValue={{ value: "", label: "" }}
            onValueChange={(value) =>
              setForm({ ...form, client_name: value?.value || "" })
            }
          >
            <SelectTrigger>
              <SelectValue
                className="text-foreground dark:text-white text-sm native:text-lg"
                placeholder="Select a client"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets}>
              <SelectGroup>
                {data?.clients?.map((item, index) => (
                  <SelectItem key={index} label={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
  
        <View>
          <Label nativeID="amount" className="pb-1">
            Amount
          </Label>
          <Input
            placeholder="00.00"
            value={form.amount.toString()}
            onChangeText={(e) => setForm({ ...form, amount: Number(e) })}
            aria-labelledby="Amount"
            aria-errormessage="inputError"
            keyboardType="default"
          />
        </View>
  
        <View>
          <Label nativeID="gcash_ref_no" className="pb-1">
            Gcash Reference No.
          </Label>
          <Input
            placeholder="00000000000"
            value={form.gcash_ref_no.toString()}
            onChangeText={(e) => setForm({ ...form, gcash_ref_no: Number(e) })}
            aria-labelledby="Gcash Reference No."
            aria-errormessage="inputError"
            keyboardType="default"
          />
        </View>
  
        <Button
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
          variant="default"
          className="text-white mt-5"
        >
          <Text>Submit Payment</Text>
        </Button>
      </>
    );
  }
  
