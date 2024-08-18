import { useSession } from "@/services/ctx";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Tab() {
  const router = useRouter();
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Sign Out
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/about")}
        style={{ marginTop: 20 }}
      >
        <Text>Go to About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
