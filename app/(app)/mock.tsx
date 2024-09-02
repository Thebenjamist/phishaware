import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  StatusBar,
} from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import ScreenLayout from "@/components/ScreenLayout";
import { FontAwesome } from "@expo/vector-icons";
import { Stats } from "@/components/StatsPieChart";
import CustomModal from "@/components/CustomModal";
import { router } from "expo-router";
import api from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

type Email = {
  id: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  messageBody: string;
  messageGreeting: string;
  messageClosing: string;
  isPhishing: boolean;
  phishingType?: "A" | "B" | "C" | null;
  status?: "read" | "unread" | "flagged";
};

type scoreItem = {
  id: string;
  status: string;
  isPhishing: boolean;
  phishingType?: "A" | "B" | "C" | null;
};

export default function Mock() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isTutorialVisible, setIsTutorialVisible] = React.useState(true);
  const [currentEmail, setCurrentEmail] = React.useState<Email | null>(null);
  const [testStarted, setTestStarted] = React.useState(false);
  const [emails, setEmails] = React.useState<Email[]>([]);
  const [score, setScore] = React.useState<scoreItem[]>([]);
  const [tutorialPage, setTutorialPage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [showScoresModal, setShowScoresModal] = useState(false);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);

  const [calculatedScore, setCalculatedScore] = React.useState<Stats>();
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

  const submitScore = async () => {
    await api("/submit-score", "POST", { score: calculatedScore })
      .then((response) => {
        console.log("Score submitted: ", response.message);
      })
      .catch((error) => {
        console.log("Error submitting score: ", error);
      });
  };

  const handleNextPage = () => {
    if (tutorialPage < tutorialPages.length - 1) {
      setTutorialPage(tutorialPage + 1);
    } else {
      setIsTutorialVisible(false);
    }
  };

  const handleStartTest = () => {
    setIsTutorialVisible(false);
    setTestStarted(true);
  };

  const handleEndTest = async () => {
    setSubmitLoading(true);
    setTestStarted(false);
    await submitScore();
    setShowScoresModal(false);
    setSubmitLoading(false);
    router.push("/");
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await api("/emails", "GET").then(
          (res) => res.data
        );
        setEmails(
          fetchedEmails.map((email: Email) => ({ ...email, status: "unread" }))
        );
        setEmailsLoading(false);
      } catch (err) {
        console.log("Failed to fetch emails: ", err);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    const calculateScore = () => {
      const emailsOpen = score.length;
      const phishingLinksOpened = score.filter(
        (item) => item.status === "read" && item.isPhishing === true
      ).length;
      const linksCorrectlyFlagged = score.filter(
        (item) => item.status === "flagged" && item.isPhishing === true
      ).length;
      const linksFalselyFlagged = score.filter(
        (item) => item.status === "flagged" && item.isPhishing === false
      ).length;
      const correctlyReplied = score.filter(
        (item) => item.status === "read" && item.isPhishing === false
      ).length;
      const typeAClicked = score.filter(
        (item) =>
          item.phishingType === "A" &&
          item.status === "read" &&
          item.isPhishing === true
      ).length;
      const typeBClicked = score.filter(
        (item) =>
          item.phishingType === "B" &&
          item.status === "read" &&
          item.isPhishing === true
      ).length;
      const typeCClicked = score.filter(
        (item) =>
          item.phishingType === "C" &&
          item.status === "read" &&
          item.isPhishing === true
      ).length;

      const final: Stats = {
        emailsOpen,
        phishingLinksOpened,
        linksCorrectlyFlagged,
        linksFalselyFlagged,
        correctlyReplied,
        typeAClicked,
        typeBClicked,
        typeCClicked,
        date: new Date(),
      };

      setCalculatedScore(final);
    };
    calculateScore();
    console.log("User score: ", calculatedScore);
  }, [score]);

  useEffect(() => {
    if (testStarted && !showScoresModal && !pauseTimer) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [testStarted, showScoresModal, pauseTimer]);

  useEffect(() => {
    if (testStarted) {
      if (
        (emails.filter((email) => email.status === "unread").length === 0 ||
          timeRemaining === 0) &&
        warningModalVisible === false
      ) {
        setShowScoresModal(true);
      }
    }
  }, [emails, timeRemaining]);

  const EmailItem = ({ email }: { email: Email }) => (
    <TouchableOpacity
      style={emailStyles.emailItem}
      onPress={() => {
        setCurrentEmail(email);
        setIsModalVisible(true);
      }}
    >
      <View style={emailStyles.textPreview}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={emailStyles.senderName}>{email.senderName}</Text>
          <Text style={emailStyles.senderEmail}>{email.senderEmail}</Text>
        </View>
        <Text style={emailStyles.subject}>{email.subject}</Text>
        <Text style={emailStyles.message} numberOfLines={1}>
          {email.messageGreeting} {email.messageBody} {email.messageClosing}
        </Text>
      </View>
      <View style={emailStyles.actionContainer}>
        <FontAwesome name="chevron-right" size={14} color="#4A5759" />
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <View
        style={{
          marginTop: StatusBar.currentHeight,
          backgroundColor: "#7796CB",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#4A5759", fontSize: 16 }}>
          {formatTime(timeRemaining)}
        </Text>
      </View>
      <ScreenLayout noPadding topAligned noMargin>
        {emailsLoading ? (
          <LoadingSpinner fullscreen />
        ) : (
          <>
            {emails.map(
              (email) =>
                email.status === "unread" && (
                  <EmailItem key={email.id} email={email} />
                )
            )}
            {emails.length === 0 && (
              <Text style={emailStyles.noEmailsText}>
                No more emails to read
              </Text>
            )}
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
                    <Text style={messageStyles.senderEmail}>
                      {currentEmail?.senderEmail}
                    </Text>
                    <Text style={messageStyles.subject}>
                      {currentEmail?.subject}
                    </Text>
                  </View>
                </View>
                <View style={messageStyles.message}>
                  <Text>{currentEmail?.messageGreeting}</Text>
                  <Text>{currentEmail?.messageBody}</Text>
                  <Text>{currentEmail?.messageClosing}</Text>
                </View>

                <View style={messageStyles.actions}>
                  <TouchableOpacity
                    style={emailStyles.viewButton}
                    onPress={() => {
                      if (currentEmail?.isPhishing) {
                        setWarningModalVisible(true);
                        setPauseTimer(true);
                      }
                      setIsModalVisible(false);
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
                      setIsModalVisible(false);
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
            <CustomModal
              isModalVisible={isTutorialVisible}
              setIsModalVisible={setIsTutorialVisible}
            >
              <View style={tutorialStyles.container}>
                <Text style={styles.modalHeader}>Tutorial</Text>
                <Text style={tutorialStyles.text}>
                  {tutorialPages[tutorialPage]}
                </Text>
                <View style={tutorialStyles.buttonContainer}>
                  {tutorialPage !== tutorialPages.length - 1 ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleNextPage}
                    >
                      <Text style={styles.buttonText}>Next</Text>
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

            <CustomModal
              isModalVisible={showScoresModal}
              setIsModalVisible={setShowScoresModal}
            >
              <Text style={[styles.modalHeader, { marginBottom: 0 }]}>
                {timeRemaining < 1 ? "Time Up" : "Mailbox Empty"}
              </Text>
              <Text style={styles.modalText}>
                Please Review Your Scores Below:
              </Text>
              <View style={scoreStyles.container}>
                <Text style={scoreStyles.scoreText}>
                  Emails Opened: {calculatedScore?.emailsOpen}
                </Text>
                <Text style={[scoreStyles.scoreText, { color: "#D83148" }]}>
                  Phishing Emails Interacted With:
                  {calculatedScore?.phishingLinksOpened}
                </Text>
                <Text style={[scoreStyles.scoreText, { color: "#D83148" }]}>
                  Emails Falsely Flagged: {calculatedScore?.linksFalselyFlagged}
                </Text>
                <Text style={[scoreStyles.scoreText, { color: "#4AAD52" }]}>
                  Emails Correctly Flagged:{" "}
                  {calculatedScore?.linksCorrectlyFlagged}
                </Text>
                <Text style={[scoreStyles.scoreText, { color: "#4AAD52" }]}>
                  Correctly Replied: {calculatedScore?.correctlyReplied}
                </Text>
                {submitLoading ? (
                  <LoadingSpinner />
                ) : (
                  <View style={scoreStyles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleEndTest}
                    >
                      <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </CustomModal>

            <CustomModal
              isModalVisible={warningModalVisible}
              setIsModalVisible={setWarningModalVisible}
            >
              <Text
                style={[
                  styles.modalHeader,
                  { marginBottom: 0, color: "#D83148" },
                ]}
              >
                ALERT
              </Text>
              <Text style={styles.modalText}>
                That was a phishing email! Please be careful with such emails.
              </Text>
              <View style={scoreStyles.container}>
                <View style={scoreStyles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setWarningModalVisible(false);
                      setPauseTimer(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CustomModal>
          </>
        )}
      </ScreenLayout>
    </>
  );
}

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
