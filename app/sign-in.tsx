import React, { useState } from "react";
import { router } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSession } from "@/services/ctx";
import { commonStyles as styles } from "@/assets/styles";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScreenLayout from "@/components/ScreenLayout";

export default function SignIn() {
  const { signIn, session, isLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    Keyboard.dismiss();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    signIn(email, password)
      .then(() => {
        router.replace("/");
      })
      .catch((err) => {
        setError(`Failed to sign in. ${err.message}`);
      });
  };

  return (
    <ScreenLayout>
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      {isLoading ? (
        <LoadingSpinner fullscreen={false} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            onFocus={() => setError("")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            onFocus={() => setError("")}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </>
      )}
    </ScreenLayout>
  );
}
