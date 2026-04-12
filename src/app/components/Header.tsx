import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Flame } from "lucide-react-native";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.titleContainer}>
        <Flame color="#ffffff" size={24} />
        <Text style={styles.title}>HeatPlan</Text>
      </View>
    </View>
  );
}
