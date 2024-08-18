import React, { useState } from "react";
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import axios from "axios";
import { getItem, setItem, clear } from "@/services/localStorage";

const poolData = {
  UserPoolId: "eu-west-2_ZKMnkVgVq", // Your user pool id here
  ClientId: "17q5kr94m44g1ggocvt37r023h", // Your client id here
};

const userPool = new CognitoUserPool(poolData);

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("Access token:", result.getAccessToken().getJwtToken());
        console.log("ID token:", result.getIdToken().getJwtToken());
        console.log("Refresh token:", result.getRefreshToken().getToken());

        setItem("refreshToken", result.getRefreshToken().getToken());
        setItem("accessToken", result.getAccessToken().getJwtToken());
        setItem("idToken", result.getIdToken().getJwtToken());
      },
      onFailure: (err) => {
        console.error("Error signing in:", err);
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login here" onPress={handleLogin} />
      <Button title="Get new tokens" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});
