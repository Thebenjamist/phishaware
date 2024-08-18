import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import ScreenLayout from "@/components/ScreenLayout";

export default function Tab() {
  return (
    <ScreenLayout>
      <Text>Tab [Home|Settings]</Text>
    </ScreenLayout>
  );
}
