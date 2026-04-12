import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Calendar,
  Trash2,
  Edit,
  Thermometer,
  Droplets,
  AlertTriangle,
  Play,
  ChevronDown,
} from "lucide-react-native";
import { Header } from "../components/Header";
import {
  availableLocations,
  getMockWeatherData,
  getWorkRestCycle,
  generateSchedule,
  fetchMilwaukeeHourlyWeatherData,
  CLOTHING_ADJUSTMENTS,
  WORKLOAD_ADJUSTMENTS,
  type ScheduleBlock,
  type ClothingType,
  type WorkloadType,
} from "../utils/wbgt";
import { getCurrentTask } from "../utils/currentTime";
import { useSelectedLocation } from "../context/LocationContext";

interface DayScheduleData {
  shiftStart: string;
  shiftEnd: string;
  lunchStart: string;
  lunchDuration: string;
  clothing: ClothingType;
  workload: WorkloadType;
  location: string;
}

interface DailySchedule {
  date: Date;
  dateString: string;
  dayOfWeek: string;
  schedule: ScheduleBlock[];
  weatherData: any;
  scheduleData: DayScheduleData;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CLOTHING_OPTIONS = Object.keys(CLOTHING_ADJUSTMENTS) as ClothingType[];
const WORKLOAD_OPTIONS = Object.keys(WORKLOAD_ADJUSTMENTS) as WorkloadType[];

const DEFAULT_DAY_SCHEDULE: DayScheduleData = {
  shiftStart: "07:00",
  shiftEnd: "15:00",
  lunchStart: "12:00",
  lunchDuration: "30",
  clothing: "Work Clothing (Baseline)",
  workload: "Moderate",
  location: "",
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "work":
      return {
        backgroundColor: "#fee2e2",
        borderColor: "#ef4444",
        textColor: "#7f1d1d",
      };
    case "rest":
      return {
        backgroundColor: "#dcfce7",
        borderColor: "#22c55e",
        textColor: "#166534",
      };
    case "lunch":
      return {
        backgroundColor: "#dbeafe",
        borderColor: "#2563eb",
        textColor: "#1e40af",
      };
    default:
      return {
        backgroundColor: "#f3f4f6",
        borderColor: "#9ca3af",
        textColor: "#374151",
      };
  }
};

const formatTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export function Schedule({ navigation }: { navigation: any }) {
  const { setSelectedLocation } = useSelectedLocation();
  const [weeklyScheduleData, setWeeklyScheduleData] = useState<Record<
    string,
    DayScheduleData
  > | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [schedule, setScheduleSchedule] = useState<ScheduleBlock[]>([]);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [weeklySchedules, setWeeklySchedules] = useState<DailySchedule[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[0]);
  const [dayFormData, setDayFormData] = useState<
    Record<string, DayScheduleData>
  >({});
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showClothingPicker, setShowClothingPicker] = useState(false);
  const [showWorkloadPicker, setShowWorkloadPicker] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  const toggleExpandedDay = (day: string) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  useEffect(() => {
    const initialFormData: Record<string, DayScheduleData> = {};
    DAYS_OF_WEEK.forEach((day) => {
      initialFormData[day] = { ...DEFAULT_DAY_SCHEDULE };
    });
    setDayFormData(initialFormData);
  }, []);

  useEffect(() => {
    const loadWeeklySchedule = async () => {
      const data = await AsyncStorage.getItem("weeklyScheduleData");
      if (data) {
        const parsed = JSON.parse(data);
        setWeeklyScheduleData(parsed);
        setDayFormData(parsed);
        await generateWeeklySchedules(parsed);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    };

    loadWeeklySchedule();
  }, []);

  const generateWeeklySchedules = async (
    weeklyData: Record<string, DayScheduleData>,
  ) => {
    const weekly: DailySchedule[] = [];
    const today = new Date();
    const currentDayOfWeek = today.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const todayData = weeklyData[currentDayOfWeek];

    if (todayData && todayData.location) {
      try {
        const todayWeather = await getMockWeatherData(todayData.location);
        if (todayWeather) {
          setWeatherData(todayWeather);
          let hourlyTempsByHour: Record<number, number> | undefined;
          let hourlyWbgtByHour: Record<number, number> | undefined;
          if (
            todayData.location.toLowerCase().replace(/\s+/g, "") ===
            "milwaukee,wi"
          ) {
            const hourlyData = await fetchMilwaukeeHourlyWeatherData(
              todayData.shiftStart,
              todayData.shiftEnd,
            );
            hourlyTempsByHour = hourlyData?.tempByHour;
            hourlyWbgtByHour = hourlyData?.wbgtByHour;
          }
          const todaySchedule = generateSchedule(
            todayData.shiftStart,
            todayData.shiftEnd,
            todayData.lunchStart,
            parseInt(todayData.lunchDuration, 10),
            todayWeather.wbgt,
            todayData.location,
            CLOTHING_ADJUSTMENTS[todayData.clothing],
            WORKLOAD_ADJUSTMENTS[todayData.workload],
            hourlyTempsByHour,
            hourlyWbgtByHour,
          );
          setScheduleSchedule(todaySchedule);
          setCurrentTask(getCurrentTask(todaySchedule));
          setSelectedLocation(todayData.location);
        }
      } catch (error) {
        console.error("Error loading today's weather:", error);
      }
    }

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayData = weeklyData[dayOfWeek];

      if (dayData && dayData.location) {
        try {
          const dayWeather = await getMockWeatherData(dayData.location);
          if (dayWeather) {
            let dayHourlyTempsByHour: Record<number, number> | undefined;
            let dayHourlyWbgtByHour: Record<number, number> | undefined;
            if (
              dayData.location.toLowerCase().replace(/\s+/g, "") ===
              "milwaukee,wi"
            ) {
              const hourlyData = await fetchMilwaukeeHourlyWeatherData(
                dayData.shiftStart,
                dayData.shiftEnd,
                date,
              );
              dayHourlyTempsByHour = hourlyData?.tempByHour;
              dayHourlyWbgtByHour = hourlyData?.wbgtByHour;
            }
            const daySchedule = generateSchedule(
              dayData.shiftStart,
              dayData.shiftEnd,
              dayData.lunchStart,
              parseInt(dayData.lunchDuration, 10),
              dayWeather.wbgt,
              dayData.location,
              CLOTHING_ADJUSTMENTS[dayData.clothing],
              WORKLOAD_ADJUSTMENTS[dayData.workload],
              dayHourlyTempsByHour,
              dayHourlyWbgtByHour,
            );
            weekly.push({
              date,
              dateString: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              dayOfWeek,
              schedule: daySchedule,
              weatherData: dayWeather,
              scheduleData: dayData,
            });
          }
        } catch (error) {
          console.error(`Error loading weather for ${dayOfWeek}:`, error);
        }
      }
    }

    setWeeklySchedules(weekly);
  };

  const handleSubmit = async () => {
    const hasValidDay = Object.values(dayFormData).some((day) => day.location);
    if (!hasValidDay) {
      Alert.alert("Please configure at least one day with a location");
      return;
    }

    await AsyncStorage.setItem(
      "weeklyScheduleData",
      JSON.stringify(dayFormData),
    );

    setWeeklyScheduleData(dayFormData);
    await generateWeeklySchedules(dayFormData);
    setIsEditing(false);
    setShowLocationPicker(false);
    setShowClothingPicker(false);
    setShowWorkloadPicker(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to delete all schedules?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("weeklyScheduleData");
            setWeeklyScheduleData(null);
            setWeatherData(null);
            setScheduleSchedule([]);
            setCurrentTask(null);
            setWeeklySchedules([]);
            setSelectedDay(DAYS_OF_WEEK[0]);
            setDayFormData(
              DAYS_OF_WEEK.reduce(
                (acc, day) => {
                  acc[day] = { ...DEFAULT_DAY_SCHEDULE };
                  return acc;
                },
                {} as Record<string, DayScheduleData>,
              ),
            );
            setIsEditing(true);
          },
        },
      ],
    );
  };

  const handleCopyToAllDays = () => {
    const currentDayData = dayFormData[selectedDay];
    const updated = { ...dayFormData };
    DAYS_OF_WEEK.forEach((day) => {
      updated[day] = { ...currentDayData };
    });
    setDayFormData(updated);
  };

  const handleFieldChange = (field: keyof DayScheduleData, value: string) => {
    setDayFormData((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [field]: value,
      },
    }));
  };

  const selectedDayData = dayFormData[selectedDay] || DEFAULT_DAY_SCHEDULE;
  const weeklyScheduleComplete = weeklySchedules.length === 7;

  useEffect(() => {
    if (schedule.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTask(getCurrentTask(schedule));
    }, 60000);

    return () => clearInterval(interval);
  }, [schedule]);

  if (!weeklyScheduleData || isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <View style={styles.centerContainer}>
            <Calendar color="#dc2626" size={48} style={styles.icon} />
            <Text style={styles.title}>
              {weeklyScheduleData
                ? "Edit Weekly Schedule"
                : "Create Weekly Schedule"}
            </Text>
            <Text style={styles.subtitle}>
              Set up heat-safe work plans for each day of the week.
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dayTabs}
            contentContainerStyle={styles.dayTabsContent}
          >
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayTab,
                  selectedDay === day && styles.dayTabActive,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={
                    selectedDay === day
                      ? styles.dayTabTextActive
                      : styles.dayTabText
                  }
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.card}>
            <Text style={styles.formSectionTitle}>Day: {selectedDay}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shift Start Time</Text>
              <TextInput
                style={styles.input}
                placeholder="07:00"
                value={selectedDayData.shiftStart}
                onChangeText={(text) => handleFieldChange("shiftStart", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shift End Time</Text>
              <TextInput
                style={styles.input}
                placeholder="15:00"
                value={selectedDayData.shiftEnd}
                onChangeText={(text) => handleFieldChange("shiftEnd", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Lunch Break Start</Text>
              <TextInput
                style={styles.input}
                placeholder="12:00"
                value={selectedDayData.lunchStart}
                onChangeText={(text) => handleFieldChange("lunchStart", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Lunch Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                value={selectedDayData.lunchDuration}
                onChangeText={(text) =>
                  handleFieldChange("lunchDuration", text)
                }
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Work Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Type city name"
                value={locationSearch || selectedDayData.location}
                onChangeText={(text) => {
                  setLocationSearch(text);
                  setShowLocationPicker(true);
                  if (text === "") {
                    handleFieldChange("location", "");
                  }
                }}
                onFocus={() => setShowLocationPicker(true)}
              />
              {showLocationPicker && (
                <View style={styles.pickerContainer}>
                  {availableLocations
                    .filter((loc) =>
                      loc.toLowerCase().includes(locationSearch.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          handleFieldChange("location", item);
                          setLocationSearch("");
                          setShowLocationPicker(false);
                        }}
                        style={styles.pickerItemRow}
                      >
                        <Text style={styles.pickerItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Clothing Type</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => {
                  setShowClothingPicker(!showClothingPicker);
                  setShowWorkloadPicker(false);
                }}
              >
                <Text style={styles.selectorText}>
                  {selectedDayData.clothing}
                </Text>
                <ChevronDown color="#6b7280" size={18} />
              </TouchableOpacity>
              {showClothingPicker && (
                <ScrollView
                  style={styles.pickerContainer}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {CLOTHING_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        handleFieldChange("clothing", item);
                        setShowClothingPicker(false);
                      }}
                      style={styles.pickerItemRow}
                    >
                      <Text
                        style={
                          item === selectedDayData.clothing
                            ? styles.pickerItemSelected
                            : styles.pickerItemText
                        }
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Workload</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => {
                  setShowWorkloadPicker(!showWorkloadPicker);
                  setShowClothingPicker(false);
                }}
              >
                <Text style={styles.selectorText}>
                  {selectedDayData.workload}
                </Text>
                <ChevronDown color="#6b7280" size={18} />
              </TouchableOpacity>
              {showWorkloadPicker && (
                <View style={styles.pickerContainer}>
                  {WORKLOAD_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        handleFieldChange("workload", item);
                        setShowWorkloadPicker(false);
                      }}
                      style={styles.pickerItemRow}
                    >
                      <Text
                        style={
                          item === selectedDayData.workload
                            ? styles.pickerItemSelected
                            : styles.pickerItemText
                        }
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {weeklyScheduleData
                  ? "Update Weekly Schedule"
                  : "Save Weekly Schedule"}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.buttonsRowItem]}
                onPress={handleCopyToAllDays}
              >
                <Text style={styles.secondaryButtonText}>Copy to All Days</Text>
              </TouchableOpacity>
              {weeklyScheduleData && (
                <TouchableOpacity
                  style={[styles.dangerButton, styles.buttonsRowItem]}
                  onPress={handleDelete}
                >
                  <Trash2 color="#ffffff" size={18} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Use location-specific heat data and weekly planning to keep your
              team safer in hot conditions.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const weekViewContent =
    weeklySchedules.length > 0 ? (
      weeklySchedules.map((day) => {
        const isExpanded = expandedDay === day.dayOfWeek;
        const summaryStart = day.schedule[0]?.startTime ?? "--";
        const summaryEnd =
          day.schedule[day.schedule.length - 1]?.endTime ?? "--";
        return (
          <View key={day.dayOfWeek} style={styles.weekCard}>
            <TouchableOpacity
              style={styles.daySummaryRow}
              onPress={() => toggleExpandedDay(day.dayOfWeek)}
            >
              <View>
                <Text style={styles.weekCardTitle}>{day.dayOfWeek}</Text>
                <Text style={styles.weekCardSubtitle}>
                  {day.weatherData.city} • {summaryStart} - {summaryEnd}
                </Text>
              </View>
              <Text style={styles.expandTrigger}>
                {isExpanded ? "Hide" : "View"}
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <>
                <View style={styles.scheduleMetaRow}>
                  <Text style={styles.metaLabel}>Location</Text>
                  <Text style={styles.metaValue}>
                    {day.scheduleData.location}
                  </Text>
                </View>
                <View style={styles.scheduleMetaRow}>
                  <Text style={styles.metaLabel}>Shift</Text>
                  <Text style={styles.metaValue}>
                    {day.scheduleData.shiftStart} - {day.scheduleData.shiftEnd}
                  </Text>
                </View>
                <View style={styles.scheduleMetaRow}>
                  <Text style={styles.metaLabel}>Lunch</Text>
                  <Text style={styles.metaValue}>
                    {day.scheduleData.lunchStart} (
                    {day.scheduleData.lunchDuration}m)
                  </Text>
                </View>
                {day.schedule.map((block, index) => (
                  <View
                    key={`${day.dayOfWeek}-${index}`}
                    style={[styles.scheduleItem, getTypeColor(block.type)]}
                  >
                    <View>
                      <Text
                        style={[
                          styles.scheduleItemType,
                          { color: getTypeColor(block.type).textColor },
                        ]}
                      >
                        {block.type}
                      </Text>
                      <Text
                        style={[
                          styles.scheduleItemTime,
                          { color: getTypeColor(block.type).textColor },
                        ]}
                      >
                        {block.startTime} - {block.endTime}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={[
                          styles.scheduleItemRight,
                          { color: getTypeColor(block.type).textColor },
                        ]}
                      >
                        {block.duration}m
                      </Text>
                      {block.wbgt !== undefined && (
                        <Text style={styles.scheduleItemWbgt}>
                          WBGT {block.wbgt}°F
                        </Text>
                      )}
                      {block.temp !== undefined && (
                        <Text style={styles.scheduleItemWbgt}>
                          Temp {block.temp}°F
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        );
      })
    ) : (
      <View style={styles.emptyStateCard}>
        <Text style={styles.emptyStateText}>
          Weekly schedule is configured, but no valid day data is available for
          the current week.
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View style={styles.centerContainer}>
          <Calendar color="#dc2626" size={48} style={styles.icon} />
          <Text style={styles.title}>Weekly Work Schedule</Text>
          <Text style={styles.subtitle}>
            {weeklyScheduleComplete
              ? "Full 7-day plan available"
              : "Review available schedule days"}
          </Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "today" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("today")}
          >
            <Text
              style={
                activeTab === "today"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonText
              }
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "week" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("week")}
          >
            <Text
              style={
                activeTab === "week"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonText
              }
            >
              Week
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { marginBottom: 16 }]}
          onPress={() => setIsEditing(true)}
        >
          <Edit color="#ffffff" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Modify Schedule</Text>
        </TouchableOpacity>

        {activeTab === "today" ? (
          <>
            <View style={[styles.card, styles.weatherCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Today&apos;s Summary</Text>
              </View>
              {weatherData ? (
                <View style={styles.weatherSummary}>
                  <View style={styles.weatherMetric}>
                    <Thermometer color="#dc2626" size={20} />
                    <Text style={styles.weatherLabel}>WBGT</Text>
                    <Text style={styles.weatherValue}>
                      {weatherData.wbgt}°F
                    </Text>
                  </View>
                  <View style={styles.weatherMetric}>
                    <Droplets color="#0ea5e9" size={20} />
                    <Text style={styles.weatherLabel}>Humidity</Text>
                    <Text style={styles.weatherValue}>
                      {weatherData.humidity}%
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyStateText}>
                  No schedule data set for today&apos;s location.
                </Text>
              )}
            </View>

            {currentTask && currentTask.isActive && (
              <View style={[styles.card, styles.currentTaskCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Current Task</Text>
                  <Text style={styles.currentTimeBadge}>
                    {currentTask.currentTime}
                  </Text>
                </View>
                <View style={styles.currentTaskContent}>
                  <View style={styles.currentTaskRow}>
                    <Text style={styles.currentTaskLabel}>Task</Text>
                    <Text style={styles.currentTaskValue}>
                      {currentTask.currentBlock.type}
                    </Text>
                  </View>
                  <View style={styles.currentTaskRow}>
                    <Text style={styles.currentTaskLabel}>Time</Text>
                    <Text style={styles.currentTaskValue}>
                      {currentTask.currentBlock.startTime} -{" "}
                      {currentTask.currentBlock.endTime}
                    </Text>
                  </View>
                  <View style={styles.currentTaskRow}>
                    <Text style={styles.currentTaskLabel}>Time left</Text>
                    <Text style={styles.currentTaskValue}>
                      {currentTask.minutesRemaining} min
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Detailed Schedule</Text>
              <Text style={styles.cardDescription}>
                {weeklyScheduleData?.[selectedDay]?.location
                  ? `${selectedDay} shift for ${weeklyScheduleData[selectedDay].location}`
                  : "Work and rest blocks for today."}
              </Text>

              {schedule.length > 0 ? (
                <View style={styles.scheduleList}>
                  {schedule.map((block, index) => {
                    const isCurrent =
                      currentTask?.currentBlock &&
                      currentTask.currentBlock.startTime === block.startTime &&
                      currentTask.currentBlock.endTime === block.endTime;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.scheduleItem,
                          getTypeColor(block.type),
                          isCurrent && styles.currentScheduleItem,
                        ]}
                      >
                        <View>
                          <Text
                            style={[
                              styles.scheduleItemType,
                              { color: getTypeColor(block.type).textColor },
                            ]}
                          >
                            {block.type}
                            {isCurrent ? " (Now)" : ""}
                          </Text>
                          <Text
                            style={[
                              styles.scheduleItemTime,
                              { color: getTypeColor(block.type).textColor },
                            ]}
                          >
                            {block.startTime} - {block.endTime}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={[
                              styles.scheduleItemRight,
                              { color: getTypeColor(block.type).textColor },
                            ]}
                          >
                            {block.duration}m
                          </Text>
                          {block.wbgt !== undefined && (
                            <Text style={styles.scheduleItemWbgt}>
                              WBGT {block.wbgt}°F
                            </Text>
                          )}
                          {block.temp !== undefined && (
                            <Text style={styles.scheduleItemWbgt}>
                              Temp {block.temp}°F
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyStateCard}>
                  <Text style={styles.emptyStateText}>
                    No schedule is available for today. Edit the schedule to add
                    a daily plan.
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.weekGrid}>{weekViewContent}</View>
        )}

        <View style={[styles.card, styles.safetyCard]}>
          <View style={styles.safetyTitle}>
            <AlertTriangle color="#b45309" size={16} />
            <Text style={styles.safetyTitleText}>Safety Reminders</Text>
          </View>
          <Text style={styles.safetyText}>
            • Monitor workers for heat illness signs
          </Text>
          <Text style={styles.safetyText}>
            • Ensure adequate water and shade available
          </Text>
          <Text style={styles.safetyText}>
            • Allow 7-14 days for heat acclimation
          </Text>
          <Text style={styles.safetyText}>
            • Adjust if conditions worsen during the day
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  centerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
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
  cardDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#f8fafc",
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
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonsRowItem: {
    flex: 1,
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 14,
    color: "#374151",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginTop: 8,
    maxHeight: 220,
  },
  pickerItemRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  pickerItemText: {
    fontSize: 14,
    color: "#374151",
  },
  pickerItemSelected: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    color: "#0c4a6e",
    lineHeight: 18,
  },
  dayTabs: {
    marginBottom: 16,
  },
  dayTabsContent: {
    paddingBottom: 12,
  },
  dayTab: {
    paddingVertical: 7, // 16% smaller than 8
    paddingHorizontal: 11, // 16% smaller than 14
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  dayTabActive: {
    backgroundColor: "#dc2626",
  },
  dayTabText: {
    color: "#374151",
    fontWeight: "600",
  },
  dayTabTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  },
  tabButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  scheduleList: {
    marginTop: 12,
  },
  scheduleItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentScheduleItem: {
    borderWidth: 3,
  },
  scheduleItemType: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  scheduleItemTime: {
    fontSize: 12,
    opacity: 0.8,
  },
  scheduleItemRight: {
    fontSize: 12,
    fontWeight: "600",
  },
  scheduleItemWbgt: {
    fontSize: 11,
    marginTop: 4,
    color: "#475569",
  },
  weatherCard: {
    borderWidth: 1,
    borderColor: "#fbbf24",
    backgroundColor: "#fffbeb",
  },
  weatherSummary: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  weatherMetric: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  weatherLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },
  weatherValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  weekGrid: {
    marginBottom: 16,
  },
  weekCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 14,
  },
  weekCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekCardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  weekCardDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  weekCardSubtitle: {
    color: "#4b5563",
    marginBottom: 12,
  },
  daySummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  expandTrigger: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563eb",
  },
  scheduleMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: "#475569",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  weekMoreText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 6,
  },
  currentTaskCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
    borderWidth: 1,
    marginBottom: 16,
  },
  currentTaskContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
  },
  currentTaskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  currentTaskLabel: {
    fontSize: 13,
    color: "#475569",
  },
  currentTaskValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  currentTimeBadge: {
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
  },
  safetyCard: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fde047",
  },
  safetyTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  safetyTitleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400e",
  },
  safetyText: {
    fontSize: 12,
    color: "#92400e",
    lineHeight: 18,
    marginBottom: 4,
  },
  emptyStateCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  emptyStateText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
  },
});
