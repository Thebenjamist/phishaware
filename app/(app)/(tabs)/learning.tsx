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
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

const resources = [
  {
    id: 1,
    thumbnail: "https://example.com/thumbnail1.jpg",
    header: "Resource 1",
    subtitle: "Description of Resource 1",
    link: "https://example.com/thumbnail1.jpg",
  },
  {
    id: 2,
    thumbnail: "https://example.com/thumbnail2.jpg",
    header: "Resource 2",
    subtitle: "Description of Resource 2",
    link: "https://example.com/thumbnail1.jpg",
  },
  ...Array(20)
    .fill(null)
    .map((_, index) => ({
      id: index + 3,
      thumbnail: `https://example.com/thumbnail${index + 3}.jpg`,
      header: `Resource ${index + 3}`,
      subtitle: `Description of Resource ${index + 3}`,
      link: `https://example.com/thumbnail${index + 3}.jpg`,
    })),
];

export default function Tab() {
  const [isModalVisible, setIsModalVisible] = useState(true);

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
          onPress={() => setIsModalVisible(false)}
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
    width: 120,
    height: 120,
    backgroundColor: "green",
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
