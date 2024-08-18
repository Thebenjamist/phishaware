import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { useSession } from "@/services/ctx";
import { commonStyles as styles } from "@/assets/styles";
import ScreenLayout from "@/components/ScreenLayout";

export default function Tab() {
  const { signOut, session } = useSession();
  return (
    <ScreenLayout>
      <Text>Tab [Home|Settings]</Text>
    </ScreenLayout>
  );
}
