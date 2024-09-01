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
    thumbnail:
      "https://media.defense.gov/2023/Oct/18/2003322403/1920/1080/0/231018-D-IM742-2222.JPG",
    header: "Phishing Guidance",
    subtitle: "How to Protect Against Evolving Phishing Attacks",
    link: "https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/3560788/how-to-protect-against-evolving-phishing-attacks/",
  },
  {
    id: 2,
    thumbnail:
      "https://www.ncsc.gov.uk/images/Artboard%205.png?mpwidth=545&mlwidth=737&twidth=961&dwidth=635&dpr=2&width=1399",
    header: "Phishing Attacks",
    subtitle: "Defending your organisation.",
    link: "https://www.ncsc.gov.uk/guidance/phishing",
  },
  {
    id: 3,
    thumbnail: "https://phishing.org/images/phishing-techniques.jpg",
    header: "EvilProxy Phishing Attack Strikes Indeed, Targets Executives",
    subtitle: "An in-depth look at common phishing methods.",
    link: "https://www.infosecurity-magazine.com/news/evilproxy-phishing-attack-strikes/",
  },
  {
    id: 4,
    thumbnail:
      "https://documents.trendmicro.com/images/tex/articles/tcc-phishing-irs.jpg",
    header: "Best Practices",
    subtitle: "Identifying and Mitigating Phishing Attacks",
    link: "https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/best-practices-identifying-and-mitigating-phishing-attacks",
  },
  {
    id: 5,
    thumbnail:
      "https://images.fastcompany.com/image/upload/f_auto,c_fit,w_1920,q_auto/wp-cms-2/2024/04/influencer-marketing-how-to-target-gen-z-.webp",
    header: "The growing threat of AI in social engineering:",
    subtitle: " How business can mitigate risks",
    link: "https://www.fastcompany.com/91088574/the-growing-threat-of-ai-in-social-engineering-how-business-can-mitigate-risks",
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
    width: 120,
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
