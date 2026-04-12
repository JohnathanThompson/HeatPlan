import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";

const ERROR_SVG_URI =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps {
  source: string;
  defaultSource?: string;
  style?: object;
  testID?: string;
  onError?: () => void;
  [key: string]: any;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
  },
});

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
    props.onError?.();
  };

  const { source, defaultSource, style, testID, ...rest } = props;

  return didError ? (
    <View style={[styles.container, style]} testID={testID}>
      <Image
        source={{ uri: ERROR_SVG_URI }}
        style={[styles.image, style]}
        {...rest}
      />
    </View>
  ) : (
    <Image
      source={{ uri: source || defaultSource }}
      style={style}
      onError={handleError}
      testID={testID}
      {...rest}
    />
  );
}
