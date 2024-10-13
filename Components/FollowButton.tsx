import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemeColoursPrimary } from "../Constants/UI";

const FollowButton = ({ title, handlePress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default FollowButton;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
});
