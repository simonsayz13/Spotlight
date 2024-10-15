import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
// 32 is a good default number
const Size = 46; // Default size of the speech bubble
const CollapsedSize = 20; // Collapsed size for the speech bubble

const MapMarker = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const animatedSize = useRef(new Animated.Value(Size)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
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
    ]).start();
  }, [collapsed]);

  return (
    <TouchableOpacity>
      {/*onPress={() => setCollapsed(!collapsed)}>*/}
      <View style={styles.container}>
        {/* Animated Icon with dynamic size and border radius */}
        <Animated.View
          style={[
            styles.bubble,
            {
              width: animatedSize,
              height: animatedSize,
              borderRadius: animatedSize,
            },
          ]}
        >
          {/* <Ionicons name="chatbubble" size={Size} color="#FF4C4C" /> */}
          {/* <Animated.View
            style={[
              styles.bubbleTail,
              {
                borderLeftWidth: animatedSize.interpolate({
                  inputRange: [CollapsedSize, Size],
                  outputRange: [CollapsedSize * 0.4, Size * 0.4], // Adjust relative to bubble size
                }),
                borderRightWidth: animatedSize.interpolate({
                  inputRange: [CollapsedSize, Size],
                  outputRange: [CollapsedSize * 0.4, Size * 0.4],
                }),
                borderTopWidth: animatedSize.interpolate({
                  inputRange: [CollapsedSize, Size],
                  outputRange: [CollapsedSize * 0.8, Size * 0.8],
                }),
              },
            ]}
          /> */}
          <Animated.Text
            style={[
              styles.iconContent,
              { opacity: animatedOpacity, fontSize: Size / 2 - 4 },
            ]}
          >
            🔥
          </Animated.Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    backgroundColor: "#FF4C4C",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bubbleTail: {
    position: "absolute",
    bottom: -6, // Slightly move up to connect with the bubble
    right: "50%",
    transform: [
      // { translateX: -6 }, // Center the tail horizontally
      { rotate: "45deg" }, // Rotate the tail to make it diagonal
    ],
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FF4C4C", // Same color as the bubble
  },
  iconContent: {
    fontSize: 24, // Size of the text/emoji inside the bubble
    color: "white", // Text color
  },
});

export default MapMarker;
