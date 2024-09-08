import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import CustomModal from "../CustomModal";
import { commonStyles as styles } from "@/assets/styles";

import { useState } from "react";
import { Stats } from "../StatsPieChart";
import LoadingSpinner from "../LoadingSpinner";
import ScreenLayout from "../ScreenLayout";
import { Email, scoreItem } from "@/app/(app)/mock";

const EmailModal = ({
  isModalVisible,
  setIsModalVisible,
  currentEmail,
  setWarningModalVisible,
  warningModalVisible,
  successModalVisible,
  setSuccessModalVisible,
  setPauseTimer,
  setEmails,
  emails,
  setScore,
  score,
}: {
  warningModalVisible: boolean;
  successModalVisible: boolean;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setWarningModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessModalVisible: React.Dispatch<React.SetStateAction<boolean>>;

  setPauseTimer: (bool: boolean) => void;
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
  emails: Email[];
  setScore: React.Dispatch<React.SetStateAction<scoreItem[]>>;
  score: scoreItem[];
  currentEmail: Email;
}) => {
  const messageStyles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f5f5f5",
      borderBottomColor: "#4A5759",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#4A5759",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    iconText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    detailsContainer: {
      flex: 1,
    },
    senderName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    senderEmail: {
      fontSize: 14,
      color: "#888",
    },
    subject: {
      fontSize: 14,
      color: "#888",
    },
    message: {
      gap: 20,
      padding: 20,
      width: "100%",
    },
    actions: {
      height: 100,
      width: "100%",
      flexDirection: "row",
      padding: 20,
      gap: 10,
    },
  });

  const emailStyles = StyleSheet.create({
    noEmailsText: {
      fontSize: 16,
      color: "#888",
      textAlign: "center",
      marginTop: 20,
    },
    listContainer: {
      width: "100%",
      backgroundColor: "red",
    },
    emailItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    senderName: {
      fontWeight: "bold",
      fontSize: 16,
    },
    senderEmail: {
      color: "gray",
      fontSize: 12,
    },
    subject: {
      marginTop: 2,
      fontWeight: "bold",
    },
    message: {
      marginTop: 0,
    },
    viewButton: {
      backgroundColor: "#B5C6E3",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      borderRadius: 10,
      marginRight: 4,
      flex: 1,
    },
    flagButton: {
      backgroundColor: "#DE5466",
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      flex: 1,
      borderRadius: 10,
    },
    textPreview: { flex: 1 },
    actionContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Modal visible={isModalVisible}>
      <ScreenLayout noMargin topAligned noPadding>
        <View style={messageStyles.header}>
          <View style={messageStyles.iconContainer}>
            <Text style={messageStyles.iconText}>
              {currentEmail?.senderName.charAt(0)}
            </Text>
          </View>
          <View style={messageStyles.detailsContainer}>
            <Text style={messageStyles.senderName}>
              {currentEmail?.senderName}
            </Text>
            <Text
              style={[
                messageStyles.senderEmail,
                (successModalVisible || warningModalVisible) && {
                  backgroundColor: "#D83148",
                  fontWeight: "bold",
                  color: "black",
                },
              ]}
            >
              {currentEmail?.senderEmail}
            </Text>
            <Text style={messageStyles.subject}>{currentEmail?.subject}</Text>
          </View>
        </View>
        <View style={messageStyles.message}>
          <Text>{currentEmail?.messageGreeting}</Text>
          <Text
            style={[
              (successModalVisible || warningModalVisible) && {
                backgroundColor: "#D83148",
                fontWeight: "bold",
                color: "black",
              },
            ]}
          >
            {currentEmail?.messageBody}
          </Text>
          <Text>{currentEmail?.messageClosing}</Text>
        </View>

        <View style={messageStyles.actions}>
          <TouchableOpacity
            style={emailStyles.viewButton}
            onPress={() => {
              if (currentEmail?.isPhishing) {
                setWarningModalVisible(true);
                setPauseTimer(true);
              } else {
                setIsModalVisible(false);
              }
              setEmails(
                emails.filter((email) => email.id !== currentEmail?.id)
              );
              currentEmail &&
                setScore([
                  ...score,
                  {
                    id: currentEmail.id,
                    status: "read",
                    isPhishing: currentEmail.isPhishing,
                    phishingType: currentEmail.phishingType,
                  },
                ]);
            }}
          >
            <Text style={styles.buttonText}>Interact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={emailStyles.flagButton}
            onPress={() => {
              if (currentEmail?.isPhishing) {
                setSuccessModalVisible(true);
                setPauseTimer(true);
              } else {
                setIsModalVisible(false);
              }
              setEmails(
                emails.filter((email) => email.id !== currentEmail?.id)
              );
              currentEmail &&
                setScore([
                  ...score,
                  {
                    id: currentEmail.id,
                    status: "flagged",
                    isPhishing: currentEmail.isPhishing,
                    phishingType: currentEmail.phishingType,
                  },
                ]);
            }}
          >
            <Text style={styles.buttonText}>Flag</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    </Modal>
  );
};

export default EmailModal;
