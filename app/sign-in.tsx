import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useSession } from "@/services/ctx";

export default function SignIn() {
  const { signIn, session, isLoading } = useSession();
  console.log("Is loading", isLoading);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          signIn("benho061995@gmail.com", "TestPassword123!").then(() => {
            router.replace("/");
          });
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
        }}
      >
        Sign In
      </Text>

      {isLoading && <Text>Loading...</Text>}

      <TouchableOpacity
        onPress={() => router.push("/about")}
        style={{ marginTop: 20 }}
      >
        <Text>Go to About</Text>
      </TouchableOpacity>
    </View>
  );
}
