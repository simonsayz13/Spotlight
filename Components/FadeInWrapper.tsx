import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";

const FadeInWrapper = ({ delay, children }) => {
  if (Platform.OS === "android") {
    return <View style={styles.container}>{children}</View>;
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Step 2: Define the fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to opacity 1
      duration: delay, // Adjust duration as needed (in milliseconds)
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FadeInWrapper;
