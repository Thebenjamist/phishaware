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
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { commonStyles as styles } from "@/assets/styles";
import LoadingSpinner from "@/components/LoadingSpinner";
import { signUpWithCognito } from "@/services/cognito";
import CustomModal from "@/components/CustomModal";
import ScreenLayout from "@/components/ScreenLayout";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const passwordPolicy = [
    {
      text: "Password must be at least 8 characters long.",
      isValid: isLengthValid,
    },
    {
      text: "Password must contain at least one uppercase letter.",
      isValid: hasUppercase,
    },
    {
      text: "Password must contain at least one lowercase letter.",
      isValid: hasLowercase,
    },
    { text: "Password must contain at least one number.", isValid: hasNumber },
    {
      text: "Password must contain at least one special character.",
      isValid: hasSpecialChar,
    },
  ];

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setIsLengthValid(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[@$!%*?&]/.test(password));
  };

  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (
      !isLengthValid ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setError("Password does not meet all requirements.");
      setConfirmPassword("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    Keyboard.dismiss();

    setIsLoading(true);
    try {
      await signUpWithCognito(email, password);
      setIsModalVisible(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to register. ${err.message}`);
      } else {
        setError("Failed to register. An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
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
              handlePasswordChange(text);
              setError("");
            }}
            onFocus={() => {
              setError("");
              setIsPasswordFocused(true);
            }}
            onBlur={() => setIsPasswordFocused(false)}
            secureTextEntry
          />
          {isPasswordFocused && (
            <View style={styles.passwordPolicy}>
              {passwordPolicy.map((policy, index) => (
                <Text
                  key={index}
                  style={policy.isValid ? styles.valid : styles.invalid}
                >
                  {policy.text}
                </Text>
              ))}
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError("");
            }}
            onFocus={() => setError("")}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.link}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </>
      )}

      <CustomModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      >
        <Text style={styles.modalText}>
          Thank you for signing up! Please check your email to verify your
          account, then you can sign in.
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
    </ScreenLayout>
  );
}
