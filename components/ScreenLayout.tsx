import { ScrollView, StatusBar as NativeStatusBar } from "react-native";
import { commonStyles as styles } from "@/assets/styles";

import { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";

const ScreenLayout = ({
  children,
  topAligned,
  noPadding,
  noMargin,
}: {
  children: ReactNode;
  topAligned?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
}) => {
  return (
    <ScrollView
      style={{
        flex: 1,
        marginTop: noMargin ? 0 : NativeStatusBar.currentHeight,
      }}
      contentContainerStyle={[
        styles.container,
        {
          padding: noPadding ? 0 : 20,
          justifyContent: topAligned ? "flex-start" : "center",
        },
      ]}
      canCancelContentTouches={true}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />
      {children}
    </ScrollView>
  );
};

export default ScreenLayout;
