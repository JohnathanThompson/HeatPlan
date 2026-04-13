// Mock weather data for different cities with varying WBGT profiles
const mockWeatherData: Record<
  string,
  {
    temp: number;
    humidity: number;
    cloudCover: number;
    windSpeed: number;
    city: string;
    lat?: number;
    lon?: number;
  }
> = {
  phoenix: {
    temp: 98,
    humidity: 25,
    cloudCover: 10,
    windSpeed: 3,
    city: "Phoenix, AZ",
  },
  miami: {
    temp: 90,
    humidity: 78,
    cloudCover: 65,
    windSpeed: 4,
    city: "Miami, FL",
  },
  houston: {
    temp: 93,
    humidity: 68,
    cloudCover: 50,
    windSpeed: 3,
    city: "Houston, TX",
  },
  lasvegas: {
    temp: 102,
    humidity: 20,
    cloudCover: 5,
    windSpeed: 4,
    city: "Las Vegas, NV",
  },
  atlanta: {
    temp: 88,
    humidity: 62,
    cloudCover: 40,
    windSpeed: 3,
    city: "Atlanta, GA",
  },
  newyork: {
    temp: 84,
    humidity: 58,
    cloudCover: 50,
    windSpeed: 5,
    city: "New York, NY",
  },
  chicago: {
    temp: 80,
    humidity: 52,
    cloudCover: 45,
    windSpeed: 8,
    city: "Chicago, IL",
  },
  seattle: {
    temp: 75,
    humidity: 48,
    cloudCover: 80,
    windSpeed: 6,
    city: "Seattle, WA",
  },
  losangeles: {
    temp: 85,
    humidity: 55,
    cloudCover: 20,
    windSpeed: 5,
    city: "Los Angeles, CA",
  },
  dallas: {
    temp: 96,
    humidity: 58,
    cloudCover: 35,
    windSpeed: 4,
    city: "Dallas, TX",
  },
  milwaukee: {
    temp: 75,
    humidity: 60,
    cloudCover: 60,
    windSpeed: 6,
    city: "Milwaukee, WI",
    lat: 43.038902,
    lon: -87.906471,
  },
};

function normalizeLocationKey(location: string): string {
  return location.toLowerCase().replace(/\s+/g, "").trim();
}

function resolveLocationData(location: string) {
  const normalized = normalizeLocationKey(location);
  if (normalized === "milwaukee,wi" || normalized === "milwaukee") {
    return mockWeatherData.milwaukee;
  }
  const cityOnly = normalized.split(",")[0];
  const compact = normalized.replace(/[^a-z]/g, "");

  return (
    mockWeatherData[normalized] ||
    mockWeatherData[cityOnly] ||
    mockWeatherData[compact] ||
    mockWeatherData.phoenix
  );
}

// Get location-specific WBGT pattern for different hours of the day
// This simulates how heat conditions change throughout the day
function getLocationWBGTPattern(location: string, hour: number): number {
  const locationKey = normalizeLocationKey(location);
  const baseData = resolveLocationData(location);

  // Different locations have different heat patterns
  switch (locationKey) {
    case "phoenix,az":
    case "phoenix":
      // Phoenix: Extreme heat variation, peaks in early afternoon
      if (hour >= 6 && hour < 9) return 77; // Normal - morning
      if (hour >= 9 && hour < 11) return 81; // Light Caution - late morning
      if (hour >= 11 && hour < 13) return 84; // Moderate Caution - midday
      if (hour >= 13 && hour < 15) return 87; // High Caution - early afternoon
      if (hour >= 15 && hour < 17) return 83; // Moderate Caution - late afternoon
      if (hour >= 17 && hour < 19) return 79; // Light Caution - evening
      return 75; // Normal - night

    case "lasvegas,nv":
    case "lasvegas":
      // Las Vegas: Very hot and dry, extreme afternoon heat
      if (hour >= 6 && hour < 9) return 79;
      if (hour >= 9 && hour < 11) return 83;
      if (hour >= 11 && hour < 13) return 86;
      if (hour >= 13 && hour < 15) return 89; // Extreme Caution
      if (hour >= 15 && hour < 17) return 85;
      if (hour >= 17 && hour < 19) return 80;
      return 76;

    case "miami,fl":
    case "miami":
      // Miami: High humidity, moderately hot all day
      if (hour >= 6 && hour < 9) return 80;
      if (hour >= 9 && hour < 11) return 83;
      if (hour >= 11 && hour < 15) return 86; // High Caution - long peak
      if (hour >= 15 && hour < 17) return 84;
      if (hour >= 17 && hour < 19) return 81;
      return 78;

    case "houston,tx":
    case "houston":
      // Houston: Hot and humid
      if (hour >= 6 && hour < 9) return 79;
      if (hour >= 9 && hour < 11) return 82;
      if (hour >= 11 && hour < 14) return 85;
      if (hour >= 14 && hour < 16) return 87;
      if (hour >= 16 && hour < 18) return 83;
      return 77;

    case "dallas,tx":
    case "dallas":
      // Dallas: Hot, moderately humid
      if (hour >= 6 && hour < 9) return 78;
      if (hour >= 9 && hour < 11) return 82;
      if (hour >= 11 && hour < 14) return 86;
      if (hour >= 14 && hour < 16) return 88;
      if (hour >= 16 && hour < 18) return 84;
      return 76;

    case "atlanta,ga":
    case "atlanta":
      // Atlanta: Moderate heat and humidity
      if (hour >= 6 && hour < 10) return 77;
      if (hour >= 10 && hour < 12) return 81;
      if (hour >= 12 && hour < 15) return 84;
      if (hour >= 15 && hour < 17) return 82;
      return 76;

    case "newyork,ny":
    case "newyork":
      // New York: Moderate summer heat
      if (hour >= 6 && hour < 10) return 75;
      if (hour >= 10 && hour < 13) return 79;
      if (hour >= 13 && hour < 16) return 82;
      if (hour >= 16 && hour < 18) return 80;
      return 74;

    case "chicago,il":
    case "chicago":
      // Chicago: Mild to moderate summer heat
      if (hour >= 6 && hour < 11) return 74;
      if (hour >= 11 && hour < 14) return 78;
      if (hour >= 14 && hour < 17) return 81;
      return 73;

    case "losangeles,ca":
    case "losangeles":
      // LA: Warm, dry, moderate heat
      if (hour >= 6 && hour < 10) return 76;
      if (hour >= 10 && hour < 13) return 80;
      if (hour >= 13 && hour < 16) return 83;
      if (hour >= 16 && hour < 18) return 81;
      return 75;

    case "seattle,wa":
    case "seattle":
      // Seattle: Cool, mild summers
      if (hour >= 6 && hour < 12) return 72;
      if (hour >= 12 && hour < 16) return 76;
      if (hour >= 16 && hour < 18) return 74;
      return 70;

    default:
      // Default pattern similar to Phoenix
      if (hour >= 6 && hour < 9) return 77;
      if (hour >= 9 && hour < 11) return 81;
      if (hour >= 11 && hour < 13) return 84;
      if (hour >= 13 && hour < 15) return 87;
      if (hour >= 15 && hour < 17) return 83;
      if (hour >= 17 && hour < 19) return 79;
      return 75;
  }
}

// Calculate WBGT from temperature and humidity (simplified formula)
// Real WBGT requires wet bulb temp, dry bulb temp, and globe temp
// This is a simplified approximation for demo purposes
export function calculateWBGT(temp: number, humidity: number): number {
  // Simplified WBGT approximation
  // WBGT ≈ 0.7 * Wet Bulb + 0.2 * Globe + 0.1 * Dry Bulb
  // For simplification: WBGT ≈ Temp - (humidity adjustment)
  const humidityFactor = (100 - humidity) / 20;
  return Math.round(temp - humidityFactor);
}

export function getWorkRestCycle(
  wbgt: number,
  clothingAdjustment: number = 0,
  workloadAdjustment: number = 0,
): {
  workMinutes: number;
  restMinutes: number;
  category: string;
  color: string;
} {
  const effectiveWBGT = wbgt + clothingAdjustment + workloadAdjustment;

  if (effectiveWBGT < 80) {
    return {
      workMinutes: 60,
      restMinutes: 0,
      category: "Normal",
      color: "green",
    };
  } else if (effectiveWBGT < 85) {
    return {
      workMinutes: 45,
      restMinutes: 15,
      category: "Light Caution",
      color: "yellow",
    };
  } else if (effectiveWBGT < 88) {
    return {
      workMinutes: 30,
      restMinutes: 30,
      category: "Moderate Caution",
      color: "orange",
    };
  } else if (effectiveWBGT < 90) {
    return {
      workMinutes: 20,
      restMinutes: 40,
      category: "High Caution",
      color: "red",
    };
  } else {
    return {
      workMinutes: 15,
      restMinutes: 45,
      category: "Extreme Caution",
      color: "red",
    };
  }
}

export async function getMockWeatherData(location: string): Promise<{
  temp: number;
  humidity: number;
  wbgt: number;
  city: string;
  cloudCover: number;
  windSpeed: number;
}> {
  const locationData = resolveLocationData(location);

  // Use real API data for locations with coordinates
  if (locationData?.lat != null && locationData?.lon != null) {
    const realData = await fetchLocationWeather(location);
    if (realData) {
      return {
        temp: realData.temp,
        humidity: realData.humidity,
        wbgt: realData.wbgt,
        city: realData.city,
        cloudCover: realData.cloudCover,
        windSpeed: realData.windSpeed,
      };
    }
    // Fallback to mock data if API fails
  }

  // Use mock data for all other locations
  const data = resolveLocationData(location);

  const wbgt = Math.round(
    celsiusToFahrenheit(
      wbgtOutdoor(
        fahrenheitToCelsius(data.temp),
        data.humidity,
        data.cloudCover,
        data.windSpeed,
      ),
    ),
  );

  return {
    temp: data.temp,
    humidity: data.humidity,
    wbgt,
    city: data.city,
    cloudCover: data.cloudCover,
    windSpeed: data.windSpeed,
  };
}

// Clothing adjustment factors (in °F)
export const CLOTHING_ADJUSTMENTS = {
  "Light Clothing": -3.6,
  "Work Clothing (Baseline)": 0,
  "Cloth coveralls": 0,
  "Spunbond melt-blown synthetic (SMS) coveralls": 0.9,
  "Polyolefin coveralls": 1.8,
  "Double-layer cloth clothing": 5.4,
  "Heavy Clothing": 4,
  "Limited user vapor barrier coveralls": 19.8,
} as const;

export type ClothingType = keyof typeof CLOTHING_ADJUSTMENTS;

// Workload adjustment factors (in °F)
export const WORKLOAD_ADJUSTMENTS = {
  Light: 0,
  Moderate: 0,
  Heavy: 3.6,
  "Very Heavy": 5.4,
} as const;

export type WorkloadType = keyof typeof WORKLOAD_ADJUSTMENTS;

export interface ScheduleBlock {
  startTime: string;
  endTime: string;
  type: "work" | "rest" | "lunch";
  duration: number;
  wbgt?: number; // Add WBGT to each block
  temp?: number; // Add actual temperature if available
}

export function generateSchedule(
  shiftStart: string,
  shiftEnd: string,
  lunchStart: string,
  lunchDuration: number,
  baseWbgt: number,
  location?: string,
  clothingAdjustment: number = 0,
  workloadAdjustment: number = 0,
  hourlyTempsByHour?: Record<number, number>,
  hourlyWbgtByHour?: Record<number, number>,
): ScheduleBlock[] {
  const schedule: ScheduleBlock[] = [];

  // Parse times
  const [startHour, startMin] = shiftStart.split(":").map(Number);
  const [endHour, endMin] = shiftEnd.split(":").map(Number);
  const [lunchHour, lunchMin] = lunchStart.split(":").map(Number);

  let currentTime = startHour * 60 + startMin; // minutes from midnight
  const endTime = endHour * 60 + endMin;
  const lunchTime = lunchHour * 60 + lunchMin;

  let currentHour = startHour;

  while (currentTime < endTime) {
    const timeStr = formatTime(currentTime);
    currentHour = Math.floor(currentTime / 60);

    // Determine temperature values for this hour if available
    const hourTemp = hourlyTempsByHour?.[currentHour];

    // Get WBGT for current hour based on API data or location pattern
    const hourWbgt =
      hourlyWbgtByHour?.[currentHour] ??
      (location ? getLocationWBGTPattern(location, currentHour) : baseWbgt);
    const { workMinutes, restMinutes } = getWorkRestCycle(
      hourWbgt,
      clothingAdjustment,
      workloadAdjustment,
    );

    // Check if it's lunch time
    if (currentTime === lunchTime) {
      schedule.push({
        startTime: timeStr,
        endTime: formatTime(currentTime + lunchDuration),
        type: "lunch",
        duration: lunchDuration,
        wbgt: hourWbgt,
        temp: hourTemp,
      });
      currentTime += lunchDuration;
      continue;
    }

    // Skip lunch period if we're in the middle of it
    if (currentTime > lunchTime && currentTime < lunchTime + lunchDuration) {
      currentTime = lunchTime + lunchDuration;
      continue;
    }

    // Work period
    const workDuration = Math.min(workMinutes, endTime - currentTime);
    if (workDuration > 0) {
      schedule.push({
        startTime: timeStr,
        endTime: formatTime(currentTime + workDuration),
        type: "work",
        duration: workDuration,
        wbgt: hourWbgt,
        temp: hourTemp,
      });
      currentTime += workDuration;
    }

    // Rest period (if applicable and not at end of shift)
    if (restMinutes > 0 && currentTime < endTime) {
      const restDuration = Math.min(restMinutes, endTime - currentTime);
      if (restDuration > 0) {
        schedule.push({
          startTime: formatTime(currentTime),
          endTime: formatTime(currentTime + restDuration),
          type: "rest",
          duration: restDuration,
          wbgt: hourWbgt,
          temp: hourTemp,
        });
        currentTime += restDuration;
      }
    }
  }

  return schedule;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
}
// Weather API functions for real WBGT calculations
function wetBulbTemperature(T: number, RH: number): number {
  // T in °C, RH in %
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

function estimateSolarRadiation(cloudCover: number): number {
  const C = cloudCover / 100;

  return (1 - 0.75 * Math.pow(C, 3)) * 1000; // W/m²
}

function globeTemperature(
  T: number,
  cloudCover: number,
  windSpeed: number,
): number {
  const GHI = estimateSolarRadiation(cloudCover);

  const v = Math.max(windSpeed, 0.1);
  const hc = 8.3 * Math.pow(v, 0.6);

  return T + ((0.7 * GHI) / hc) * 0.01;
}

function wbgtOutdoor(
  T: number,
  RH: number,
  cloudCover: number,
  windSpeed: number,
): number {
  const Tdb = T;
  const Twb = wetBulbTemperature(T, RH);
  const Tg = globeTemperature(T, cloudCover, windSpeed);

  return 0.7 * Twb + 0.2 * Tg + 0.1 * Tdb;
}

function wbgtOutdoorFromHourlyObserved(
  T: number,
  wetBulbT: number,
  shortwaveRadiation: number,
  cloudCover: number,
  windSpeed: number,
): number {
  // shortwaveRadiation in W/m^2; convert to a coarse globe-temp uplift.
  const solarLoad = (shortwaveRadiation / 1000) * 12;
  const cloudDampening = 1 - cloudCover / 100;
  const windCooling = Math.sqrt(Math.max(windSpeed, 0)) * 1.8;
  const Tg = T + solarLoad * cloudDampening - windCooling;

  return 0.7 * wetBulbT + 0.2 * Tg + 0.1 * T;
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

// Convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Fetch real weather data for a location with coordinates
async function fetchLocationWeather(location: string): Promise<{
  temp: number;
  humidity: number;
  wbgt: number;
  cloudCover: number;
  windSpeed: number;
  hourlyWbgt: number[];
  city: string;
} | null> {
  try {
    const locationData = resolveLocationData(location);
    if (!locationData?.lat || !locationData?.lon) {
      return null;
    }

    const params = {
      latitude: locationData.lat,
      longitude: locationData.lon,
      hourly: [
        "temperature_2m",
        "wet_bulb_temperature_2m",
        "shortwave_radiation",
        "relative_humidity_2m",
        "cloud_cover",
        "wind_speed_10m",
      ],
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "cloud_cover",
        "wind_speed_10m",
      ],
      forecast_hours: 6, // Get current + 5 hours
    };
    const url = "https://api.open-meteo.com/v1/forecast";

    const response = await fetch(
      url +
        "?" +
        new URLSearchParams({
          latitude: params.latitude.toString(),
          longitude: params.longitude.toString(),
          hourly: params.hourly.join(","),
          current: params.current.join(","),
          forecast_hours: params.forecast_hours.toString(),
        }),
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const current = data.current;
    const hourly = data.hourly;

    if (!current || !hourly) {
      return null;
    }

    const temperatureCelsius = current.temperature_2m;
    const relativeHumidity = current.relative_humidity_2m;
    const cloudCover = current.cloud_cover;
    const windSpeed = current.wind_speed_10m;

    // Calculate current WBGT
    const wbgt = wbgtOutdoor(
      temperatureCelsius,
      relativeHumidity,
      cloudCover,
      windSpeed,
    );

    // Calculate hourly WBGT for next 6 hours
    const hourlyWbgt: number[] = [];
    for (let i = 0; i < Math.min(6, hourly.temperature_2m.length); i++) {
      const hourTemp = hourly.temperature_2m[i];
      const hourWetBulb = hourly.wet_bulb_temperature_2m[i];
      const hourShortwaveRadiation = hourly.shortwave_radiation[i];
      const hourCloudCover = hourly.cloud_cover[i];
      const hourWindSpeed = hourly.wind_speed_10m[i];

      const hourWbgt = wbgtOutdoorFromHourlyObserved(
        hourTemp,
        hourWetBulb,
        hourShortwaveRadiation,
        hourCloudCover,
        hourWindSpeed,
      );
      hourlyWbgt.push(Math.round(celsiusToFahrenheit(hourWbgt)));
    }

    return {
      temp: Math.round(celsiusToFahrenheit(temperatureCelsius)),
      humidity: Math.round(relativeHumidity),
      wbgt: Math.round(celsiusToFahrenheit(wbgt)),
      cloudCover,
      windSpeed,
      hourlyWbgt,
      city: locationData.city,
    };
  } catch (error) {
    console.error("Error fetching location weather:", error);
    return null;
  }
}
export async function fetchLocationHourlyWeatherData(
  location: string,
  shiftStart: string,
  shiftEnd: string,
  date: Date = new Date(),
): Promise<{
  tempByHour: Record<number, number>;
  wbgtByHour: Record<number, number>;
} | null> {
  try {
    const locationData = resolveLocationData(location);
    if (!locationData?.lat || !locationData?.lon) {
      return null;
    }

    const [startHour] = shiftStart.split(":").map(Number);
    const [endHour] = shiftEnd.split(":").map(Number);
    const startDate = formatDateLocal(date);
    const endDate = new Date(date);

    if (endHour <= startHour) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const endDateString = formatDateLocal(endDate);
    const url = "https://api.open-meteo.com/v1/forecast";
    const response = await fetch(
      url +
        "?" +
        new URLSearchParams({
          latitude: locationData.lat.toString(),
          longitude: locationData.lon.toString(),
          hourly: [
            "temperature_2m",
            "wet_bulb_temperature_2m",
            "shortwave_radiation",
            "relative_humidity_2m",
            "cloud_cover",
            "wind_speed_10m",
          ].join(","),
          timezone: "America/Chicago",
          start_date: startDate,
          end_date: endDateString,
        }),
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const hourly = data.hourly;
    if (
      !hourly ||
      !Array.isArray(hourly.time) ||
      !Array.isArray(hourly.temperature_2m) ||
      !Array.isArray(hourly.wet_bulb_temperature_2m) ||
      !Array.isArray(hourly.shortwave_radiation) ||
      !Array.isArray(hourly.relative_humidity_2m) ||
      !Array.isArray(hourly.cloud_cover) ||
      !Array.isArray(hourly.wind_speed_10m)
    ) {
      return null;
    }

    const tempByHour: Record<number, number> = {};
    const wbgtByHour: Record<number, number> = {};
    for (let i = 0; i < hourly.time.length; i++) {
      const timeString = hourly.time[i];
      const hourString = timeString.slice(11, 13);
      const hour = Number(hourString);
      const tempC = hourly.temperature_2m[i];
      const wetBulbC = hourly.wet_bulb_temperature_2m[i];
      const shortwaveRadiation = hourly.shortwave_radiation[i];
      const cloudCover = hourly.cloud_cover[i];
      const windSpeed = hourly.wind_speed_10m[i];
      tempByHour[hour] = Math.round(celsiusToFahrenheit(tempC));
      const wbgtC = wbgtOutdoorFromHourlyObserved(
        tempC,
        wetBulbC,
        shortwaveRadiation,
        cloudCover,
        windSpeed,
      );
      wbgtByHour[hour] = Math.round(celsiusToFahrenheit(wbgtC));
    }

    return { tempByHour, wbgtByHour };
  } catch (error) {
    console.error("Error fetching location hourly weather data:", error);
    return null;
  }
}

export const availableLocations = [
  "Phoenix, AZ",
  "Miami, FL",
  "Houston, TX",
  "Las Vegas, NV",
  "Atlanta, GA",
  "New York, NY",
  "Chicago, IL",
  "Seattle, WA",
  "Los Angeles, CA",
  "Dallas, TX",
  "Milwaukee, WI",
];

export interface ForecastData {
  hour: string;
  time: string;
  wbgt: number;
  temp: number;
  humidity: number;
}

// Generate forecast data for the next 5 hours based on location
export async function generateForecast(
  currentWBGT: number,
  currentTemp: number,
  currentHumidity: number,
  location?: string,
): Promise<ForecastData[]> {
  const forecast: ForecastData[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  // If location has coordinates, use real API data
  const locationData = location ? resolveLocationData(location) : undefined;
  if (location && locationData?.lat != null && locationData?.lon != null) {
    const realData = await fetchLocationWeather(location);
    if (realData && realData.hourlyWbgt.length >= 6) {
      // Use real hourly WBGT data
      for (let i = 0; i < 6; i++) {
        const futureHour = (currentHour + i) % 24;
        const wbgt = realData.hourlyWbgt[i];
        const temp = i === 0 ? realData.temp : Math.round(wbgt + 8); // Current temp from API, others estimated
        const humidity = i === 0 ? realData.humidity : currentHumidity; // Use current humidity for all hours

        forecast.push({
          hour: i === 0 ? "Now" : `+${i}h`,
          time: formatHour(futureHour),
          wbgt: wbgt,
          temp: temp,
          humidity: humidity,
        });
      }
      return forecast;
    }
  }

  // Fallback to mock data when API data is unavailable
  if (location) {
    const wbgt = getLocationWBGTPattern(location, currentHour);
    forecast.push({
      hour: "Now",
      time: formatHour(currentHour),
      wbgt: wbgt,
      temp: Math.round(wbgt + 8), // Temp is usually ~8°F higher than WBGT
      humidity: currentHumidity,
    });

    // Generate next 5 hours with location-specific progression
    for (let i = 1; i <= 5; i++) {
      const futureHour = (currentHour + i) % 24;
      const wbgt = getLocationWBGTPattern(location, futureHour);
      const temp = Math.round(wbgt + 8);
      const humidity = currentHumidity + Math.round((Math.random() - 0.5) * 10);

      forecast.push({
        hour: `+${i}h`,
        time: formatHour(futureHour),
        wbgt: wbgt,
        temp: temp,
        humidity: Math.max(15, Math.min(90, humidity)),
      });
    }
  } else {
    // Original generic forecast generation
    forecast.push({
      hour: "Now",
      time: formatHour(currentHour),
      wbgt: currentWBGT,
      temp: currentTemp,
      humidity: currentHumidity,
    });

    for (let i = 1; i <= 5; i++) {
      const futureHour = (currentHour + i) % 24;
      const wbgt = Math.round(currentWBGT + (Math.random() - 0.5) * 4);
      const temp = Math.round(currentTemp + (Math.random() - 0.5) * 5);
      const humidity = Math.round(currentHumidity + (Math.random() - 0.5) * 10);

      forecast.push({
        hour: `+${i}h`,
        time: formatHour(futureHour),
        wbgt: Math.max(70, Math.min(95, wbgt)),
        temp: Math.max(75, Math.min(110, temp)),
        humidity: Math.max(15, Math.min(90, humidity)),
      });
    }
  }

  return forecast;
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${period}`;
}

export function getWBGTColor(wbgt: number): string {
  if (wbgt < 80) return "#22c55e"; // green
  if (wbgt < 85) return "#eab308"; // yellow
  if (wbgt < 88) return "#f97316"; // orange
  if (wbgt < 90) return "#ef4444"; // red
  return "#dc2626"; // dark red
}

export function getWBGTBackgroundColor(wbgt: number): string {
  if (wbgt < 80) return "#dcfce7"; // green-100
  if (wbgt < 85) return "#fef9c3"; // yellow-100
  if (wbgt < 88) return "#ffedd5"; // orange-100
  if (wbgt < 90) return "#fee2e2"; // red-100
  return "#fecaca"; // red-200
}
