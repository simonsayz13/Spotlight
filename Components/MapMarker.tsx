import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const Size = 36; // Default size of the speech bubble
const CollapsedSize = 12; // Collapsed size for the speech bubble

const MapMarker = ({ tag, collapsed }: any) => {
  // Shared values for animation states
  const animatedSize = useSharedValue(Size);
  const animatedOpacity = useSharedValue(1);

  useEffect(() => {
    // Update shared values when 'collapsed' changes
    animatedSize.value = withTiming(collapsed ? CollapsedSize : Size, {
      duration: 300,
    });
    animatedOpacity.value = withTiming(collapsed ? 0 : 1, { duration: 300 });
  }, [collapsed]);

  // Animated styles
  const bubbleStyle = useAnimatedStyle(() => {
    return {
      width: animatedSize.value,
      height: animatedSize.value,
      backgroundColor: tag.colour,
      borderTopLeftRadius: interpolate(
        animatedSize.value,
        [CollapsedSize, Size],
        [CollapsedSize / 2, Size / 2]
      ),
      borderTopRightRadius: interpolate(
        animatedSize.value,
        [CollapsedSize, Size],
        [CollapsedSize / 2, Size / 2]
      ),
      borderBottomRightRadius: interpolate(
        animatedSize.value,
        [CollapsedSize, Size],
        [CollapsedSize / 2, Size / 2]
      ),
      borderBottomLeftRadius: interpolate(
        animatedSize.value,
        [CollapsedSize, Size],
        [CollapsedSize / 2, Size / 2]
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
      fontSize: animatedSize.value / 2 - 4,
    };
  });

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Animated.View style={[styles.bubble, bubbleStyle]}>
          <Animated.Text style={[styles.iconContent, textStyle]}>
            {tag.icon}
          </Animated.Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  iconContent: {
    color: "white", // Text color
  },
});

export default MapMarker;
