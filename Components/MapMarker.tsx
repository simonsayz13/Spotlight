import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
// 32 is a good default number
const Size = 36; // Default size of the speech bubble
const CollapsedSize = 12; // Collapsed size for the speech bubble

const MapMarker = ({ tag, collapsed }: any) => {
  // const [collapsed, setCollapsed] = useState<boolean>(false);

  const animatedSize = useRef(new Animated.Value(Size)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define the animation when 'collapsed' changes
    Animated.parallel([
      Animated.timing(animatedSize, {
        toValue: collapsed ? CollapsedSize : Size,
        duration: 300, // Duration for the animation
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: collapsed ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTranslateX, {
        // Move right when expanded, left when collapsed
        toValue: collapsed ? -6 : 12, // 10 units to the right when expanded, -30 units to the left when collapsed
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTranslateY, {
        // Move up when expanded, down when collapsed
        toValue: collapsed ? 6 : -12, // -10 units up when expanded, 30 units down when collapsed
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [collapsed]);
  // onPress={() => setCollapsed(!collapsed)}>
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.bubble,
            {
              backgroundColor: tag.colour,
              width: animatedSize,
              height: animatedSize,
              borderTopLeftRadius: animatedSize.interpolate({
                inputRange: [CollapsedSize, Size],
                outputRange: [CollapsedSize / 2, Size / 2], // Keep round for top-left
              }),
              borderTopRightRadius: animatedSize.interpolate({
                inputRange: [CollapsedSize, Size],
                outputRange: [CollapsedSize / 2, Size / 2], // Keep round for top-right
              }),
              borderBottomRightRadius: animatedSize.interpolate({
                inputRange: [CollapsedSize, Size],
                outputRange: [CollapsedSize / 2, Size / 2], // Keep round for bottom-right
              }),
              borderBottomLeftRadius: animatedSize.interpolate({
                inputRange: [CollapsedSize, Size],
                outputRange: [CollapsedSize / 2, 0],
              }),
              transform: [
                { translateX: animatedTranslateX },
                { translateY: animatedTranslateY },
              ],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.iconContent,
              { opacity: animatedOpacity, fontSize: Size / 2 - 4 },
            ]}
          >
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
    position: "relative",
  },
  iconContent: {
    fontSize: 24, // Size of the text/emoji inside the bubble
    color: "white", // Text color
  },
});

export default MapMarker;
