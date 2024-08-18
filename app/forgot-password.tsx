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
import { useRouter } from "expo-router";
import { resetPasswordWithCognito } from "@/services/cognito";
import CustomModal from "@/components/CustomModal";
import { commonStyles as styles } from "@/assets/styles";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScreenLayout from "@/components/ScreenLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordWithCognito(email);
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
          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            onPress={() => router.push(`/sign-in?email=${email}`)}
          >
            <Text style={styles.link}>Remembered your password? Sign In</Text>
          </TouchableOpacity>

          <CustomModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          >
            <Text style={styles.modalText}>
              A verification code has been sent to your email address. Please
              check your email to reset your password.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setIsModalVisible(!isModalVisible);
                router.push({
                  pathname: "/confirm-reset-password",
                  params: { email },
                });
              }}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </CustomModal>
        </>
      )}
    </ScreenLayout>
  );
};

export default ForgotPassword;
