import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loader = ({
  size = "large",
  color = "#ff0000",
  backgroundColor = "#fff",
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size={size} color={color} />
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
});

export default Loader;
