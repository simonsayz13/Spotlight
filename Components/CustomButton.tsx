import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { ThemeColoursPrimary } from "../Constants/UI";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: any) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.buttonContainer,
        isLoading && styles.disabledButton,
        containerStyles, // Additional custom styles can be passed in this prop
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 16,
    minHeight: 62,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#F9FAFB",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default CustomButton;
