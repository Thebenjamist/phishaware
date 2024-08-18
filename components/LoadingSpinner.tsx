import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { commonStyles } from "@/assets/styles";

const LoadingSpinner = ({ fullscreen }: { fullscreen: boolean }) => {
  const styles = StyleSheet.create({
    loadingSpinnerContainer: {
      flex: fullscreen ? 1 : 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.loadingSpinnerContainer}>
      <ActivityIndicator size="large" color="#7796CB" />
    </View>
  );
};

export default LoadingSpinner;
