import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

const FadeInWrapper = ({ delay, children }) => {
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
    <Animated.View style={[styles.fadingContainer, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fadingContainer: {
    flex: 1,
  },
});

export default FadeInWrapper;
