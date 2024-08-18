import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { confirmPasswordWithCognito } from "@/services/cognito";
import { commonStyles as styles } from "@/assets/styles";
import CustomModal from "@/components/CustomModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScreenLayout from "@/components/ScreenLayout";

const ConfirmResetPassword = () => {
  const { email } = useLocalSearchParams();
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirmResetPassword = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    Keyboard.dismiss(); // Dismiss the keyboard

    setIsLoading(true);
    try {
      await confirmPasswordWithCognito(
        email.toString(),
        verificationCode,
        newPassword
      );
      setIsModalVisible(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to reset password. ${err.message}`);
      } else {
        setError("Failed to reset password. An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenLayout>
      {isLoading ? (
        <LoadingSpinner fullscreen />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setVerificationCode(numericText);
              setError("");
            }}
            onFocus={() => setError("")}
            keyboardType="numeric"
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setError("");
            }}
            onFocus={() => setError("")}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError("");
            }}
            onFocus={() => setError("")}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmResetPassword}
          >
            <Text style={styles.buttonText}>Confirm Reset</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.link}>Remembered your password? Sign In</Text>
          </TouchableOpacity>

          <CustomModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          >
            <Text style={styles.modalText}>
              Password reset successful! You can now sign in with your new
              password.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setIsModalVisible(!isModalVisible);
                router.replace("/sign-in");
              }}
            >
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </CustomModal>
        </>
      )}
    </ScreenLayout>
  );
};

export default ConfirmResetPassword;
