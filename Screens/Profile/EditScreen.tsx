import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const EditScreen = () => {
  return (
    <View>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPressIn={goBack} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32, // same width as the icon
  },
});

export default EditScreen;
