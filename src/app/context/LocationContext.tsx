import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LocationContextType {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocationState] =
    useState<string>("Phoenix, AZ");

  // load stored location once on mount
  useEffect(() => {
    AsyncStorage.getItem("selectedLocation").then((stored) => {
      if (stored) {
        setSelectedLocationState(stored);
      }
    });
  }, []);

  const setSelectedLocation = (location: string) => {
    setSelectedLocationState(location);
    AsyncStorage.setItem("selectedLocation", location);
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useSelectedLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedLocation must be used within a LocationProvider",
    );
  }
  return context;
}
