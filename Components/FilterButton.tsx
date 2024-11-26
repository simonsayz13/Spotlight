import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColoursPrimary } from "../Constants/UI";

const FilterButton = ({
  selectedTag,
  setSelectedTag,
  onFilterButtonPress,
}: any) => {
  const animatedWidth = useSharedValue(40); // For animation width
  const opacityAnim = useSharedValue(0); // For opacity animation

  useEffect(() => {
    if (selectedTag) {
      // Expand button and fade in
      animatedWidth.value = withTiming(selectedTag.label.length * 12 + 40, {
        duration: 300,
      });
      opacityAnim.value = withTiming(1, { duration: 400 });
    } else {
      // Shrink button and fade out
      animatedWidth.value = withTiming(40, { duration: 300 });
      opacityAnim.value = withTiming(0, { duration: 300 });
    }
  }, [selectedTag]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    width: animatedWidth.value,
    backgroundColor: selectedTag
      ? selectedTag.colour
      : ThemeColoursPrimary.LogoColour,
  }));

  const taggedButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
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
          style={[styles.taggedButtonContainer, taggedButtonAnimatedStyle]}
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
    backgroundColor: ThemeColoursPrimary.LogoColour,
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
