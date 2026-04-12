import React, { useEffect } from "react";
import { View, Text } from "react-native";

export function NotFound({ navigation }: { navigation: any }) {
  useEffect(() => {
    navigation.navigate("Home");
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Redirecting...</Text>
    </View>
  );
}
