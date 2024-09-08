import React from "react";
import { Text, TouchableOpacity } from "react-native";
import ScreenLayout from "@/components/ScreenLayout";
import { useSession } from "@/services/ctx";
import { commonStyles as styles } from "@/assets/styles";

export default function Profile() {
  const { user, signOut } = useSession();

  return (
    <ScreenLayout>
      <Text style={{ marginBottom: 20 }}>Signed in as: {user?.email}</Text>
      <TouchableOpacity
        onPress={() => {
          signOut();
        }}
        style={[styles.button, { marginBottom: 20 }]}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}
