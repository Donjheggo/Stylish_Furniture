import { Input } from "~/components/ui/input";
import { useLocalSearchParams, router } from "expo-router";
import { useDebouncedCallback } from "use-debounce"; // delay the function
import { Search } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export default function SearchBar() {
  const params = useLocalSearchParams<{ query?: string }>();

  const handleSearch = useDebouncedCallback((search: string) => {
    router.setParams({ query: search });
  }, 300);

  return (
    <View className="relative justify-center">
      <Search style={styles.icon} />
      <Input
        style={{paddingLeft: 40, fontSize: 20}}
        className="dark:bg-black dark:text-white"
        placeholder=""
        defaultValue={params.query}
        onChangeText={(text) => {
          handleSearch(text);
        }}
        aria-labelledby="inputLabel"
        aria-errormessage="inputError"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
    color: "#B08968",
  },
});
