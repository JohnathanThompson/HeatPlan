import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import {
  Thermometer,
  MapPin,
  TrendingUp,
  ChevronDown,
} from "lucide-react-native";
import { Header } from "../components/Header";
import { WBGTInfo } from "../components/WBGTInfo";
import { ForecastChart } from "../components/ForecastChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getMockWeatherData,
  getWorkRestCycle,
  generateForecast,
  availableLocations,
  type ForecastData,
  CLOTHING_ADJUSTMENTS,
  WORKLOAD_ADJUSTMENTS,
} from "../utils/wbgt";
import { useSelectedLocation } from "../context/LocationContext";

interface NavigationProp {
  navigate: (route: string) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectorButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 14,
    color: "#374151",
  },
  wbgtCard: {
    backgroundColor: "#fef2f2",
    borderWidth: 2,
    borderColor: "#fecaca",
  },
  wbgtCenter: {
    alignItems: "center",
    marginBottom: 16,
  },
  wbgtGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  wbgtGridItem: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  wbgtGridLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  wbgtGridValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  wbgtDescription: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  workRestCycle: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 8,
  },
  workRestText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  workRestDetail: {
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  recommendationCard: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: "#b45309",
    lineHeight: 18,
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "80%",
    maxHeight: "80%",
  },
  pickerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  pickerList: {
    paddingHorizontal: 16,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  pickerItemText: {
    fontSize: 16,
  },
  pickerItemSelected: {
    color: "#dc2626",
    fontWeight: "600",
  },
});

export function Home({ navigation }: { navigation: any }) {
  const { selectedLocation, setSelectedLocation } = useSelectedLocation();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [workRestCycle, setWorkRestCycle] = useState<any>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [weeklyScheduleComplete, setWeeklyScheduleComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoading(true);
      try {
        const data = await getMockWeatherData(selectedLocation);
        if (data) {
          setWeatherData(data);
          setWorkRestCycle(getWorkRestCycle(data.wbgt));
          const forecastData = await generateForecast(
            data.wbgt,
            data.temp,
            data.humidity,
            selectedLocation,
          );
          setForecast(forecastData);
        } else {
          // Fallback to mock data if API fails
          console.warn("Weather API failed, using fallback data");
          const fallbackLocation =
            selectedLocation === "Milwaukee, WI"
              ? "Chicago, IL"
              : selectedLocation;
          const fallbackData = await getMockWeatherData(fallbackLocation);
          setWeatherData(fallbackData);
          setWorkRestCycle(getWorkRestCycle(fallbackData.wbgt));
          const forecastData = await generateForecast(
            fallbackData.wbgt,
            fallbackData.temp,
            fallbackData.humidity,
            fallbackLocation,
          );
          setForecast(forecastData);
        }
      } catch (error) {
        console.error("Error loading weather data:", error);
        // Use Chicago as fallback for any errors
        const fallbackData = await getMockWeatherData("Chicago, IL");
        setWeatherData(fallbackData);
        setWorkRestCycle(getWorkRestCycle(fallbackData.wbgt));
        const forecastData = await generateForecast(
          fallbackData.wbgt,
          fallbackData.temp,
          fallbackData.humidity,
          "Chicago, IL",
        );
        setForecast(forecastData);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();
  }, [selectedLocation]);

  useEffect(() => {
    const loadWeeklySchedule = async () => {
      const scheduleData = await AsyncStorage.getItem("weeklyScheduleData");
      if (scheduleData) {
        const parsed = JSON.parse(scheduleData);
        const today = new Date();
        const currentDayOfWeek = today.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const todayData = parsed[currentDayOfWeek];

        const isComplete = DAYS_OF_WEEK.every(
          (day) => parsed[day] && parsed[day].location,
        );
        setWeeklyScheduleComplete(isComplete);
        setHasSchedule(true);

        if (todayData && todayData.location) {
          const todayWeather = await getMockWeatherData(todayData.location);
          setWeatherData(todayWeather);
          setWorkRestCycle(
            getWorkRestCycle(
              todayWeather.wbgt,
              CLOTHING_ADJUSTMENTS[todayData.clothing] || 0,
              WORKLOAD_ADJUSTMENTS[todayData.workload] || 0,
            ),
          );
          const forecastData = await generateForecast(
            todayWeather.wbgt,
            todayWeather.temp,
            todayWeather.humidity,
            todayData.location,
          );
          setForecast(forecastData);
        }
      } else {
        setHasSchedule(false);
      }
    };

    loadWeeklySchedule();
  }, []);

  if (isLoading || !weatherData || !workRestCycle) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getWorkRestColors = (color: string) => {
    switch (color) {
      case "green":
        return {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          textColor: "#166534",
        };
      case "yellow":
        return {
          backgroundColor: "#fef3c7",
          borderColor: "#eab308",
          textColor: "#92400e",
        };
      case "orange":
        return {
          backgroundColor: "#fed7aa",
          borderColor: "#fb923c",
          textColor: "#92400e",
        };
      case "red":
        return {
          backgroundColor: "#fee2e2",
          borderColor: "#ef4444",
          textColor: "#7f1d1d",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          borderColor: "#9ca3af",
          textColor: "#374151",
        };
    }
  };

  const cycleColors = getWorkRestColors(workRestCycle.color);
  const wbgtColor = [
    "#166534", // green
    "#92400e", // yellow
    "#92400e", // orange
    "#7f1d1d", // red
  ][
    weatherData.wbgt < 78
      ? 0
      : weatherData.wbgt < 82
        ? 1
        : weatherData.wbgt < 85
          ? 2
          : 3
  ];

  const getRecommendation = () => {
    if (weatherData.wbgt >= 88) {
      return "Extreme heat conditions. Minimize outdoor work and take frequent breaks.";
    } else if (weatherData.wbgt >= 85) {
      return "High heat stress. Implement strict work-rest cycles and monitor workers closely.";
    } else if (weatherData.wbgt >= 82) {
      return "Moderate heat stress. Regular breaks and hydration are essential.";
    } else if (weatherData.wbgt >= 78) {
      return "Light heat stress. Maintain regular hydration and monitor for symptoms.";
    } else {
      return "Normal conditions. Standard work schedule applies with regular hydration.";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {/* Location Selector */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setLocationModalVisible(true)}
          >
            <Text style={styles.selectorText}>{selectedLocation}</Text>
            <ChevronDown color="#6b7280" size={20} />
          </TouchableOpacity>
        </View>

        {/* Current WBGT Display */}
        <View style={[styles.card, styles.wbgtCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current WBGT</Text>
            <WBGTInfo />
          </View>

          <View style={styles.wbgtCenter}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <Thermometer color="#dc2626" size={48} />
              <Text
                style={{ fontSize: 56, fontWeight: "bold", color: "#dc2626" }}
              >
                {weatherData.wbgt}°
              </Text>
            </View>
            <Text style={styles.wbgtDescription}>
              Wet Bulb Globe Temperature
            </Text>
          </View>

          <View style={styles.wbgtGrid}>
            <View style={styles.wbgtGridItem}>
              <Text style={styles.wbgtGridLabel}>Temperature</Text>
              <Text style={styles.wbgtGridValue}>{weatherData.temp}°F</Text>
            </View>
            <View style={styles.wbgtGridItem}>
              <Text style={styles.wbgtGridLabel}>Humidity</Text>
              <Text style={styles.wbgtGridValue}>{weatherData.humidity}%</Text>
            </View>
          </View>

          <View style={[styles.workRestCycle, cycleColors]}>
            <Text
              style={[styles.workRestText, { color: cycleColors.textColor }]}
            >
              {workRestCycle.category}
            </Text>
            <Text
              style={[styles.workRestDetail, { color: cycleColors.textColor }]}
            >
              {workRestCycle.workMinutes > 0 ? (
                <>
                  {workRestCycle.workMinutes}m work{" "}
                  {workRestCycle.restMinutes > 0 &&
                    `/ ${workRestCycle.restMinutes}m rest`}
                </>
              ) : (
                "Normal work schedule"
              )}
            </Text>
          </View>
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Schedule")}
        >
          <Text style={styles.buttonText}>
            {hasSchedule ? "Modify Work Schedule" : "Create Schedule"}
          </Text>
        </TouchableOpacity>

        {/* Recommendation Card */}
        <View style={[styles.card, styles.recommendationCard]}>
          <View style={styles.recommendationTitle}>
            <TrendingUp color="#ea580c" size={20} />
            <Text style={{ fontSize: 14, fontWeight: "600" }}>
              Today's Recommendation
            </Text>
          </View>
          <Text style={styles.recommendationText}>{getRecommendation()}</Text>
        </View>

        {/* Forecast Chart */}
        <ForecastChart forecast={forecast} />
      </ScrollView>

      {/* Location Picker Modal */}
      <Modal
        visible={locationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Location</Text>
            </View>
            <FlatList
              data={availableLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedLocation(item);
                    setLocationModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedLocation === item && styles.pickerItemSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
