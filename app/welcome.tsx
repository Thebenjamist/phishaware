import React from "react";
import { router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  StatusBar as NativeStatusBar,
} from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import { StatusBar } from "expo-status-bar";
import ScreenLayout from "@/components/ScreenLayout";

export default function Welcome() {
  return (
    <ScreenLayout>
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      <Text style={styles.welcomeText}>PhishAware App</Text>
      <TouchableOpacity
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => router.push("/sign-in")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/sign-up")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}
