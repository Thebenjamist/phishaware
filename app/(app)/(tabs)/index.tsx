import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useSession } from "@/services/ctx";
import { commonStyles as styles } from "@/assets/styles";
import ScreenLayout from "@/components/ScreenLayout";
import { useRouter } from "expo-router";
import StatsPieChart, { Stats } from "@/components/StatsPieChart";
import { useEffect, useState } from "react";
import api from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Tab() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setStatsLoading(true);
        const scores = (await api("/scores", "GET").then(
          (res) => res.data
        )) as Stats[];
        const sortedStats = scores.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setStats(sortedStats);
      } catch (error) {
        console.error("Error fetching scores: ", error);
      }
      setStatsLoading(false);
    };
    fetchScores();
  }, []);

  return (
    <>
      <View
        style={{
          marginTop: StatusBar.currentHeight,
        }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderRadius: 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
            },
          ]}
          onPress={() => router.push("/mock")}
        >
          <Text style={styles.buttonText}>Begin Phishing Test</Text>
        </TouchableOpacity>
      </View>

      <ScreenLayout topAligned noPadding noMargin>
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          {statsLoading ? (
            <LoadingSpinner fullscreen />
          ) : (
            <>
              {stats.length > 0 ? (
                stats.map((stat) => (
                  <StatsPieChart key={stat.id} stats={stat} />
                ))
              ) : (
                <Text>
                  No scores logged, please run a test to see how you score
                </Text>
              )}
            </>
          )}
        </View>
      </ScreenLayout>
    </>
  );
}
