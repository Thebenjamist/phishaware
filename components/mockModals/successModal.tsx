import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomModal from "../CustomModal";
import { commonStyles as styles } from "@/assets/styles";

import { useState } from "react";
import { Stats } from "../StatsPieChart";
import LoadingSpinner from "../LoadingSpinner";
import { Email } from "@/app/(app)/mock";

const SuccessModal = ({
  isModalVisible,
  setIsModalVisible,
  setPauseTimer,
  currentEmail,
  setIsEmailModalVisible,
}: {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPauseTimer: (bool: boolean) => void;
  currentEmail: Email | null;
  setIsEmailModalVisible: (bool: boolean) => void;
}) => {
  const scoreStyles = StyleSheet.create({
    scoreText: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 4,
      textAlign: "left",
    },
    buttonContainer: {
      width: "100%",
      marginTop: 20,
    },
    container: {
      width: "100%",
    },
  });
  return (
    <CustomModal
      noBackground
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
    >
      <Text
        style={[
          styles.modalHeader,
          {
            marginBottom: 0,
            color: "#4AAD52",
          },
        ]}
      >
        FLAGGED EMAIL CORRECTLY
      </Text>
      <Text style={styles.modalText}>
        {currentEmail?.phishingType === "A" &&
          `That was a phishing email, be wary of these!! Do not interact with it.`}
        {currentEmail?.phishingType === "B" &&
          `This was a phishing email attempting to steal your credentials!! Do not interact with it.`}
        {currentEmail?.phishingType === "C" &&
          `That was a phishing email attempting to download malware onto your system!! Do not interact with it.`}
      </Text>
      <View style={scoreStyles.container}>
        <View style={scoreStyles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsModalVisible(false);
              setPauseTimer(false);
              setIsEmailModalVisible(false);
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

export default SuccessModal;
