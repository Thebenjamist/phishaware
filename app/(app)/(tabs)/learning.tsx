import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  BackHandler,
} from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import ScreenLayout from "@/components/ScreenLayout";
import CustomModal from "@/components/CustomModal";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSession } from "@/services/ctx";
import api from "@/services/api";

const resources = [
  {
    id: 1,
    thumbnail: "https://phishingquiz.withgoogle.com/static/share-7e4bdf41.jpg",
    header: "Take Jigsaw's Phishing Quiz",
    subtitle: "Can you spot when you're being phished?",
    link: "https://phishingquiz.withgoogle.com/",
  },
  {
    id: 2,
    thumbnail: "https://i.ytimg.com/vi/XsOWczwRVuc/maxresdefault.jpg",
    header: "What Is Phishing? How Do I Avoid the Bait?",
    subtitle: "What is phishing? Phishing attacks are o...",
    link: "https://www.youtube.com/watch?v=XsOWczwRVuc",
  },
  {
    id: 3,
    thumbnail:
      "https://www.terranovasecurity.com/sites/default/files/styles/og_image/public/2024-02/social-media-phishing-scams.jpg?itok=BIEnxB8C",
    header: "Countering The 5 Most Common Social Media Phishing Scams",
    subtitle:
      "Social media has created a new breed of phishing. This article will explain them so you can stay protected.",
    link: "https://www.terranovasecurity.com/blog/most-common-social-media-phishing-scams",
  },
  {
    id: 4,
    thumbnail:
      "https://www.itgovernance.co.uk/blog/wp-content/uploads/2022/10/shutterstock_1742400716.jpg",
    header:
      "10 Ways to Prevent Phishing Attacks in 2023 - IT Governance UK Blog",
    subtitle:
      "Phishing attacks are among the most common forms of cyber crime that organisations face, so it’s crucial that you learn how to prevent scams.",
    link: "https://www.itgovernance.co.uk/blog/10-ways-to-prevent-phishing-attacks-in-2023",
  },
  {
    id: 5,
    thumbnail: "https://www.ncsc.gov.uk/images/Artboard%205.png",
    header: "Phishing attacks: defending your organisation",
    subtitle: "How to defend your organisation from email phishing attacks.",
    link: "https://www.ncsc.gov.uk/guidance/phishing",
  },
];

export default function Tab() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user, fetchUser } = useSession();

  const updateFirstTimeOpen = async () => {
    await api("/update-first-time-open", "GET")
      .then((response) => {
        console.log("First time open updated: ", response);
      })
      .catch((error) => {
        console.log("Error updating first time open: ", error);
      });
  };

  useEffect(() => {
    if (user?.firstTimeOpen) {
      setIsModalVisible(true);
    }
  }, [user]);

  const handleModalClose = async () => {
    await updateFirstTimeOpen();
    await fetchUser();
    setIsModalVisible(false);
  };

  const handleResourcePress = (link: string) => {
    Linking.openURL(link).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <ScreenLayout topAligned noPadding>
      {resources.map((resource, index) => (
        <TouchableOpacity
          key={resource.id}
          onPress={() => handleResourcePress(resource.link)}
          style={
            index === 0
              ? styles1.firstResourceContainer
              : styles1.resourceContainer
          }
        >
          <Image
            source={{ uri: resource.thumbnail }}
            style={styles1.resourceThumbnail}
          />
          <View style={styles1.resourceTextContainer}>
            <Text style={styles1.resourceHeader}>{resource.header}</Text>
            <Text style={styles1.resourceSubtitle}>{resource.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <CustomModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      >
        <Text style={styles.modalHeader}>Learning Materials</Text>
        <Text style={{ marginBottom: 20 }}>
          Explore curated resources on phishing attacks and how to mitigate your
          risk
        </Text>

        <TouchableOpacity
          onPress={() => handleModalClose()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </CustomModal>
    </ScreenLayout>
  );
}

const styles1 = StyleSheet.create({
  resourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    gap: 10,
  },
  firstResourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: 10,
  },
  resourceThumbnail: {
    width: 200,
    height: 120,
    backgroundColor: "lightgray",
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resourceSubtitle: {
    fontSize: 14,
    color: "#4A5759",
  },
});
