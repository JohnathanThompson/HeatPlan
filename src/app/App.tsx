import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Home } from "./pages/Home";
import { Schedule } from "./pages/Schedule";
import {
  Home as HomeIcon,
  Calendar as CalendarIcon,
} from "lucide-react-native";
import { LocationProvider } from "./context/LocationContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
    </Stack.Navigator>
  );
}

function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ScheduleScreen" component={Schedule} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocationProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                if (route.name === "Home") {
                  return <HomeIcon color={color} size={size} />;
                } else if (route.name === "Schedule") {
                  return <CalendarIcon color={color} size={size} />;
                }
              },
              tabBarActiveTintColor: "#ef4444",
              tabBarInactiveTintColor: "#9ca3af",
              tabBarLabelStyle: { fontSize: 12 },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeStack}
              options={{
                title: "Home",
              }}
            />
            <Tab.Screen
              name="Schedule"
              component={ScheduleStack}
              options={{
                title: "Schedule",
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </GestureHandlerRootView>
  );
}
