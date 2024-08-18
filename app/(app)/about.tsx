// index.tsx
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "@/services/ctx";

export default function Index() {
  const { signOut, session } = useSession();
  const router = useRouter();

  // console.log("session", session ? JSON.parse(session).idToken : "");

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
