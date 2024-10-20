import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ThemeColoursPrimary } from "../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";

const FilterButton = ({
  selectedTag,
  setSelectedTag,
  onFilterButtonPress,
}: any) => {
  const animatedWidth = useRef(new Animated.Value(40)).current; // For animation width
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedTag) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1, // Fully visible
          duration: 400, // Animation duration
          useNativeDriver: true,
        }),
        Animated.timing(animatedWidth, {
          toValue: selectedTag.label.length * 12 + 40, // Dynamically calculate width based on label length
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      opacityAnim.setValue(0);
      Animated.timing(opacityAnim, {
        toValue: 0, // Fully visible
        duration: 300, // Animation duration
        useNativeDriver: true,
      }).start();
      Animated.timing(animatedWidth, {
        toValue: 40,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedTag]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: animatedWidth,
          backgroundColor: selectedTag
            ? selectedTag.colour
            : ThemeColoursPrimary.SecondaryColour,
        },
      ]}
    >
      {!selectedTag ? (
        <TouchableOpacity
          style={styles.buttonBase}
          onPressIn={onFilterButtonPress}
        >
          <FontAwesome5
            name="search"
            size={22}
            color={ThemeColoursPrimary.PrimaryColour}
          />
        </TouchableOpacity>
      ) : (
        <Animated.View
          style={[styles.taggedButtonContainer, { opacity: opacityAnim }]}
        >
          <TouchableOpacity onPressIn={onFilterButtonPress}>
            <Text style={styles.tagLabelText}>{selectedTag.label}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTag(null)}>
            <Ionicons
              name="close"
              size={26}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    borderRadius: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBase: {
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    borderRadius: 25,
    padding: 2,
    elevation: 5,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  taggedButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagLabelText: {
    fontSize: 18,
    color: ThemeColoursPrimary.PrimaryColour,
    fontWeight: "bold",
  },
});

export default FilterButton;
