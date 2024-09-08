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
import TutorialModal from "@/components/mockModals/tutorialModal";
import ScoresModal from "@/components/mockModals/scoresModal";
import WarningModal from "@/components/mockModals/warningModal";
import EmailModal from "@/components/mockModals/emailModal";
import SuccessModal from "@/components/mockModals/successModal";

export type Email = {
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

export type scoreItem = {
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
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [showScoresModal, setShowScoresModal] = useState(false);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [calculatedScore, setCalculatedScore] = React.useState<Stats>();

  const submitScore = async () => {
    await api("/submit-score", "POST", { score: calculatedScore })
      .then((response) => {
        console.log("Score submitted: ", response.message);
      })
      .catch((error) => {
        console.log("Error submitting score: ", error);
      });
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
  const selectRandomEmails = (emails: Email[]) => {
    const shuffled = [...emails].sort(() => 0.5 - Math.random()).slice(0, 10);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await api("/emails", "GET").then(
          (res) => res.data
        );
        if (fetchedEmails.length === 0) throw new Error("No emails found");
        const shuffledEmails = selectRandomEmails(fetchedEmails);
        setEmails(
          shuffledEmails.map((email: Email) => ({ ...email, status: "unread" }))
        );
        setEmailsLoading(false);
      } catch (err) {
        router.push("/");
        alert("Failed to fetch emails. Please try again.");
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
            <EmailModal
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              currentEmail={currentEmail!}
              setEmails={setEmails}
              setScore={setScore}
              warningModalVisible={warningModalVisible}
              setWarningModalVisible={setWarningModalVisible}
              emails={emails}
              score={score}
              setPauseTimer={setPauseTimer}
              successModalVisible={successModalVisible}
              setSuccessModalVisible={setSuccessModalVisible}
            />

            <TutorialModal
              isModalVisible={isTutorialVisible}
              setIsModalVisible={setIsTutorialVisible}
              handleStartTest={handleStartTest}
            />

            <ScoresModal
              isModalVisible={showScoresModal}
              setIsModalVisible={setShowScoresModal}
              calculatedScore={calculatedScore}
              submitLoading={submitLoading}
              handleEndTest={handleEndTest}
              timeRemaining={timeRemaining}
            />

            <WarningModal
              isModalVisible={warningModalVisible}
              setIsModalVisible={setWarningModalVisible}
              setPauseTimer={setPauseTimer}
              setIsEmailModalVisible={setIsModalVisible}
              currentEmail={currentEmail}
            />

            <SuccessModal
              isModalVisible={successModalVisible}
              setIsModalVisible={setSuccessModalVisible}
              setPauseTimer={setPauseTimer}
              setIsEmailModalVisible={setIsModalVisible}
              currentEmail={currentEmail}
            />
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
