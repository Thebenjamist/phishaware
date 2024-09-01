import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScreenLayout from "@/components/ScreenLayout";
import { useSession } from "@/services/ctx";
import { useRouter } from "expo-router";
import { commonStyles as styles } from "@/assets/styles";
import CustomModal from "@/components/CustomModal";

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useSession();
  console.log(user);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

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
