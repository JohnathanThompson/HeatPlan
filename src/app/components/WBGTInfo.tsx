import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Info, Thermometer, X } from "lucide-react-native";

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  cycleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  cycleLabel: {
    fontWeight: "600",
    fontSize: 12,
  },
  cycleValue: {
    fontSize: 12,
  },
  tipItem: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 6,
    lineHeight: 18,
  },
});

export function WBGTInfo() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Info color="#dc2626" size={20} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Thermometer color="#dc2626" size={24} />
                <Text style={styles.title}>WBGT Guidelines</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#6b7280" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What is WBGT?</Text>
                <Text style={styles.sectionText}>
                  Wet Bulb Globe Temperature (WBGT) is a measure of
                  environmental heat stress that takes into account temperature,
                  humidity, wind speed, and solar radiation.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work-Rest Cycles</Text>
                <View
                  style={[styles.cycleItem, { backgroundColor: "#dcfce7" }]}
                >
                  <Text style={[styles.cycleLabel, { color: "#166534" }]}>
                    Below 78°F
                  </Text>
                  <Text style={[styles.cycleValue, { color: "#166534" }]}>
                    Normal work
                  </Text>
                </View>
                <View
                  style={[styles.cycleItem, { backgroundColor: "#fef3c7" }]}
                >
                  <Text style={[styles.cycleLabel, { color: "#92400e" }]}>
                    78-81.9°F
                  </Text>
                  <Text style={[styles.cycleValue, { color: "#92400e" }]}>
                    45/15 min
                  </Text>
                </View>
                <View
                  style={[styles.cycleItem, { backgroundColor: "#fed7aa" }]}
                >
                  <Text style={[styles.cycleLabel, { color: "#92400e" }]}>
                    82-84.9°F
                  </Text>
                  <Text style={[styles.cycleValue, { color: "#92400e" }]}>
                    30/30 min
                  </Text>
                </View>
                <View
                  style={[styles.cycleItem, { backgroundColor: "#fee2e2" }]}
                >
                  <Text style={[styles.cycleLabel, { color: "#7f1d1d" }]}>
                    85-87.9°F
                  </Text>
                  <Text style={[styles.cycleValue, { color: "#7f1d1d" }]}>
                    20/40 min
                  </Text>
                </View>
                <View
                  style={[styles.cycleItem, { backgroundColor: "#fecaca" }]}
                >
                  <Text style={[styles.cycleLabel, { color: "#7f1d1d" }]}>
                    88°F+
                  </Text>
                  <Text style={[styles.cycleValue, { color: "#7f1d1d" }]}>
                    10/50 min
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Safety Tips</Text>
                <Text style={styles.tipItem}>
                  • Monitor workers for heat illness signs
                </Text>
                <Text style={styles.tipItem}>
                  • Ensure adequate water and shade
                </Text>
                <Text style={styles.tipItem}>
                  • Allow heat acclimation period (7-14 days)
                </Text>
                <Text style={styles.tipItem}>
                  • Hydrate before, during, and after work
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
