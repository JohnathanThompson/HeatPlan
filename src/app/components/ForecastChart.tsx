import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import {
  type ForecastData,
  getWBGTColor,
  getWBGTBackgroundColor,
} from "../utils/wbgt";

interface ForecastChartProps {
  forecast: ForecastData[];
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  forecastItem: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    borderWidth: 2,
    minWidth: 48, // 20% smaller than 60
  },
  hour: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  temp: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  time: {
    fontSize: 10,
    color: "#6b7280",
  },
});

const screenWidth = Dimensions.get("window").width - 32;

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
  },
};

export function ForecastChart({ forecast }: ForecastChartProps) {
  const data = {
    labels: forecast.map((item) => item.hour),
    datasets: [
      {
        data: forecast.map((item) => item.wbgt),
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderDotContent = ({
    x,
    y,
    index,
  }: {
    x: number;
    y: number;
    index: number;
  }) => {
    const wbgt = forecast[index].wbgt;
    const color = getWBGTColor(wbgt);
    return (
      <View
        key={`dot-${index}`}
        style={{
          position: "absolute",
          left: x - 6,
          top: y - 6,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: "#ffffff",
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp color="#dc2626" size={20} />
        <Text style={styles.title}>WBGT Forecast</Text>
      </View>
      <View style={{ position: "relative" }}>
        <LineChart
          data={data}
          width={screenWidth}
          height={150}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          renderDotContent={renderDotContent}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.forecastContainer}>
          {forecast.map((item, index) => (
            <View
              key={`forecast-${index}`}
              style={[
                styles.forecastItem,
                {
                  backgroundColor: getWBGTBackgroundColor(item.wbgt),
                  borderColor: getWBGTColor(item.wbgt),
                },
              ]}
            >
              <Text style={styles.hour}>{item.hour}</Text>
              <Text style={[styles.temp, { color: getWBGTColor(item.wbgt) }]}>
                {item.wbgt}°
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
