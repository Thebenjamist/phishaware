import {
  Text,
  View,
  StatusBar as NativeStatusBar,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/services/ctx";
import LoadingSpinner from "@/components/LoadingSpinner";
import { commonStyles as styles } from "@/assets/styles";
import ScreenLayout from "@/components/ScreenLayout";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <ScreenLayout>
        <LoadingSpinner fullscreen />
      </ScreenLayout>
    );
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
