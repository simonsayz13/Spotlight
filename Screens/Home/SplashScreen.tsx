import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, StatusBar, Animated } from "react-native";
import { ThemeColoursPrimary } from "../../Constants/UI";
import { images } from "../../Constants";

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity is 1

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Start the fade out animation after 1000ms
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar hidden={true} />
      <Image source={images.logo} resizeMode="cover" style={styles.logo} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
  },
  logo: {
    width: 70,
    height: 70,
  },
});

export default SplashScreen;
