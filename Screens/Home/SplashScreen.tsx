import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { ThemeColoursPrimary } from "../../Constants/UI";
import { images } from "../../Constants";
const { width } = Dimensions.get("window");
const SplashScreen = ({ fadeOutEffect = false }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity is 1

  useEffect(() => {
    if (fadeOutEffect) {
      const timeout = setTimeout(() => {
        // Start the fade out animation after 1000ms
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar hidden={true} />
      <Image source={images.splash} resizeMode="cover" style={styles.logo} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});

export default SplashScreen;
