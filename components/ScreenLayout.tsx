import { ScrollView, StatusBar as NativeStatusBar } from "react-native";
import { commonStyles as styles } from "@/assets/styles";

import { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";

const ScreenLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ScrollView
      style={{
        flex: 1,
        marginTop: NativeStatusBar.currentHeight,
      }}
      contentContainerStyle={styles.container}
      canCancelContentTouches={true}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />
      {children}
    </ScrollView>
  );
};

export default ScreenLayout;
