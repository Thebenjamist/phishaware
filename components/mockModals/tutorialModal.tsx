import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomModal from "../CustomModal";
import { commonStyles as styles } from "@/assets/styles";

import { useState } from "react";

const TutorialModal = ({
  isModalVisible,
  setIsModalVisible,
  handleStartTest,
}: {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleStartTest: () => void;
}) => {
  const [tutorialPage, setTutorialPage] = useState(0);
  const tutorialStyles = StyleSheet.create({
    container: {
      alignItems: "center",
      width: "100%",
    },
    text: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 40,
    },
    buttonContainer: {
      flexDirection: "column",
      gap: 10,
      width: "100%",
    },
  });

  const tutorialPages = [
    "In this tutorial, you will learn how to complete the test. Please read the instructions carefully.",
    "Your task is to clear out all the emails. Read each email carefully to determine if it is a phishing email or not.",
    "For context, a phishing email is a fraudulent email that appears to be from a legitimate source. It often contains a malicious link or attachment.",
    "Additionally, in this test you will do a bit of role-playing",
    "You are a new employee at a company and your company has a policy of responding to all emails within 5 minutes",
    "You will need to read each email and decide whether to interact with it or flag it as a phishing email.",
    "The domain of the company you work for is 'under-pressure.com'. If you receive an email from this domain, it is safe to interact with.",
    "You have a time limit indicated above the mailbox. Good luck!",
  ];
  const handleNextPage = () => {
    if (tutorialPage < tutorialPages.length - 1) {
      setTutorialPage(tutorialPage + 1);
    } else {
      setIsModalVisible(false);
    }
  };
  return (
    <CustomModal
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
    >
      <View style={tutorialStyles.container}>
        <Text style={styles.modalHeader}>Tutorial</Text>
        <Text style={tutorialStyles.text}>{tutorialPages[tutorialPage]}</Text>
        <View style={tutorialStyles.buttonContainer}>
          {tutorialPage !== tutorialPages.length - 1 ? (
            <TouchableOpacity style={styles.button} onPress={handleNextPage}>
              <Text style={styles.buttonText}>
                Next {tutorialPage + 1}/{tutorialPages.length}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#4AAD52" }]}
              onPress={handleStartTest}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </CustomModal>
  );
};

export default TutorialModal;
