import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

export type Stats = {
  id?: string;
  emailsOpen: number;
  phishingLinksOpened: number;
  linksCorrectlyFlagged: number;
  linksFalselyFlagged: number;
  correctlyReplied: number;
  typeAClicked: number;
  typeBClicked: number;
  typeCClicked: number;
  date: Date;
};

const StatsPieChart = ({ stats }: { stats: Stats }) => {
  const {
    id,
    emailsOpen,
    correctlyReplied,
    phishingLinksOpened,
    linksCorrectlyFlagged,
    linksFalselyFlagged,
  } = stats;

  const colors = {
    phishingLinksOpened: "#FF6F61", // Coral
    linksCorrectlyFlagged: "#6B8E23", // Olive Drab
    correctlyReplied: "#90EE90", // Light Green
    linksFalselyFlagged: "#4682B4", // Steel Blue
  };

  const data = [
    {
      name: "Phishing Links Opened",
      population: phishingLinksOpened,
      color: colors.phishingLinksOpened,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Links Correctly Flagged",
      population: linksCorrectlyFlagged,
      color: colors.linksCorrectlyFlagged,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Correct Replies",
      population: correctlyReplied,
      color: colors.correctlyReplied,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Links Falsely Flagged",
      population: linksFalselyFlagged,
      color: colors.linksFalselyFlagged,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <PieChart
          data={data}
          width={150}
          height={150}
          chartConfig={{
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"36"}
          center={[0, 0]}
          absolute
          hasLegend={false}
        />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.phishingLinksOpened },
              ]}
            />
            <Text style={styles.statText}>
              Phishing Links Opened: {phishingLinksOpened}
            </Text>
          </View>
          <View style={styles.statItem}>
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.linksCorrectlyFlagged },
              ]}
            />
            <Text style={styles.statText}>
              Links Correctly Flagged: {linksCorrectlyFlagged}
            </Text>
          </View>
          <View style={styles.statItem}>
            <View
              style={[styles.dot, { backgroundColor: colors.correctlyReplied }]}
            />
            <Text style={styles.statText}>
              Correctly Replied: {correctlyReplied}
            </Text>
          </View>
          <View style={styles.statItem}>
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.linksFalselyFlagged },
              ]}
            />
            <Text style={styles.statText}>
              Links Falsely Flagged: {linksFalselyFlagged}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "white",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsContainer: {
    flex: 1,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "blue",
    marginRight: 10,
  },
  statText: {},
});

export default StatsPieChart;
