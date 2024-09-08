import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomModal from "../CustomModal";
import { commonStyles as styles } from "@/assets/styles";

import { useState } from "react";
import { Stats } from "../StatsPieChart";
import LoadingSpinner from "../LoadingSpinner";

const ScoresModal = ({
  isModalVisible,
  setIsModalVisible,
  handleEndTest,
  timeRemaining,
  calculatedScore,
  submitLoading,
}: {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleEndTest: () => void;
  timeRemaining: number;
  calculatedScore: Stats | undefined;
  submitLoading: boolean;
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
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
    >
      <Text style={[styles.modalHeader, { marginBottom: 0 }]}>
        {timeRemaining < 1 ? "Time Up" : "Mailbox Empty"}
      </Text>
      <Text style={styles.modalText}>Please Review Your Scores Below:</Text>
      <View style={scoreStyles.container}>
        <Text style={scoreStyles.scoreText}>
          Emails Opened: {calculatedScore?.emailsOpen}
        </Text>
        <Text style={[scoreStyles.scoreText, { color: "#D83148" }]}>
          Phishing Emails Interacted With:{" "}
          {calculatedScore?.phishingLinksOpened}
        </Text>
        <Text style={[scoreStyles.scoreText, { color: "#D83148" }]}>
          Emails Falsely Flagged: {calculatedScore?.linksFalselyFlagged}
        </Text>
        <Text style={[scoreStyles.scoreText, { color: "#4AAD52" }]}>
          Emails Correctly Flagged: {calculatedScore?.linksCorrectlyFlagged}
        </Text>
        <Text style={[scoreStyles.scoreText, { color: "#4AAD52" }]}>
          Correctly Replied: {calculatedScore?.correctlyReplied}
        </Text>
        {submitLoading ? (
          <LoadingSpinner />
        ) : (
          <View style={scoreStyles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleEndTest}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </CustomModal>
  );
};

export default ScoresModal;
