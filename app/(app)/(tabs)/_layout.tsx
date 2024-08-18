import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7796CB",
        tabBarInactiveTintColor: "#4A5759",
        headerShown: false,
        tabBarShowLabel: false,
      }}
      // sceneContainerStyle={{ backgroundColor: " }}
    >
      <Tabs.Screen
        name="learning"
        options={{
          title: "Learning Materials",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="envelope" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
