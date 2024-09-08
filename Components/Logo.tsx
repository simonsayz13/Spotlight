import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HexagonIcon = ({ width = 200, height = 115, text = "LINKIFY" }) => {
  const hexagonHeight = height;
  const hexagonWidth = width;
  const triangleHeight = hexagonHeight / 2;

  return (
    <View style={styles.container}>
      <View
        style={[styles.hexagon, { width: hexagonWidth, height: hexagonHeight }]}
      >
        <View
          style={[
            styles.hexagonBefore,
            {
              borderLeftWidth: hexagonWidth / 2,
              borderRightWidth: hexagonWidth / 2,
              borderBottomWidth: triangleHeight,
            },
          ]}
        />
        <View
          style={[
            styles.hexagonInner,
            { width: hexagonWidth, height: hexagonHeight },
          ]}
        >
          <Text style={styles.text}>{text}</Text>
        </View>
        <View
          style={[
            styles.hexagonAfter,
            {
              borderLeftWidth: hexagonWidth / 2,
              borderRightWidth: hexagonWidth / 2,
              borderTopWidth: triangleHeight,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2798d", // Background color similar to your image
  },
  hexagon: {
    justifyContent: "center",
    alignItems: "center",
  },
  hexagonInner: {
    backgroundColor: "#fff", // White background inside hexagon
    justifyContent: "center",
    alignItems: "center",
  },
  hexagonBefore: {
    position: "absolute",
    top: -57.5,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff", // Same as hexagonInner background color
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -57.5,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff", // Same as hexagonInner background color
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#f2798d", // Same color as background
  },
});

export default HexagonIcon;
