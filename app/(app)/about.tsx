import { Text, View } from "react-native";

import { useSession } from "@/services/ctx";

export default function Index() {
  const { signOut, session } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        About {session}
      </Text>
    </View>
  );
}
