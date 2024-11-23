import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
type LoaderSizeType = "small" | "medium" | "large";

const LoaderSize: Record<LoaderSizeType, { width: number; height: number }> = {
  small: {
    width: 30,
    height: 30,
  },
  medium: {
    width: 50,
    height: 50,
  },
  large: {
    width: 75,
    height: 75,
  },
};

interface LoaderProps {
  size: LoaderSizeType;
}

const Loader = (props: LoaderProps) => {
  const { size } = props;
  return (
    <View style={[styles.container]}>
      <LottieView
        source={require("../assets/lottie-animations/spotlight-loading-bar.json")} // Path to your Lottie animation file
        autoPlay
        loop
        style={LoaderSize[size]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure loader is on top
    ...StyleSheet.absoluteFillObject,
  },
  animation: {
    width: 50,
    height: 50,
  },
});

export default Loader;
