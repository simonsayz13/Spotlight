import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const FadeInWrapper = ({ delay, children }) => {
  // Shared value for opacity
  const opacity = useSharedValue(0);

  // Effect to trigger the animation
  useEffect(() => {
    opacity.value = withTiming(1, { duration: delay });
  }, [opacity, delay]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (Platform.OS === "android") {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
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
