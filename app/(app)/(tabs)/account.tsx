import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScreenLayout from "@/components/ScreenLayout";
import { useSession } from "@/services/ctx";
import { useRouter } from "expo-router";
import { commonStyles as styles } from "@/assets/styles";
import CustomModal from "@/components/CustomModal";

export default function Profile() {
  const router = useRouter();
  const { signOut } = useSession();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <ScreenLayout>
      <TouchableOpacity
        onPress={() => {
          signOut();
        }}
        style={[styles.button, { marginBottom: 20 }]}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true);
        }}
        style={styles.buttonAlt}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      <CustomModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <Text style={styles.modalHeader}>Delete Account</Text>
        <Text style={{ marginBottom: 20 }}>
          Are you sure you would like to delete your account?
        </Text>
        <TouchableOpacity
          style={[styles.button, { marginBottom: 10 }]}
          onPress={() => {
            console.log("Delete Account");
            signOut();
          }}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonAlt}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </CustomModal>
    </ScreenLayout>
  );
}
