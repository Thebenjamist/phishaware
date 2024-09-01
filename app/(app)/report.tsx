import { ScrollView, StatusBar, Text, View } from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import { useSession } from "@/services/ctx";
import ScreenLayout from "@/components/ScreenLayout";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { signOut, session } = useSession();
  const { id } = useLocalSearchParams();

  console.log("reportId", id);

  return (
    <ScreenLayout topAligned>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Report
      </Text>
    </ScreenLayout>
  );
}
