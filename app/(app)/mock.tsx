import { ScrollView, StatusBar, Text, View } from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import { useSession } from "@/services/ctx";
import ScreenLayout from "@/components/ScreenLayout";

export default function Index() {
  const { signOut, session } = useSession();
  return (
    <ScreenLayout>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        About {session}
      </Text>
    </ScreenLayout>
  );
}
