import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ThemeColoursPrimary } from "../Constants/UI";
const { width } = Dimensions.get("window");
const CustomTabBar = (props: any) => {
  const { state, descriptors, navigation, isVisible } = props;
  const translateY = useSharedValue(0); // Initial position (visible)
  const underlinePosition = useSharedValue(0);

  // Animate translateY based on `isVisible`
  useEffect(() => {
    translateY.value = isVisible ? 0 : -100; // Move down when hidden
  }, [isVisible]);

  useEffect(() => {
    underlinePosition.value =
      state.index * (width / state.routes.length) +
      (width / state.routes.length - width / 4) / 2; // Centering logic
  }, [state.index]);

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(underlinePosition.value, { duration: 160 }) },
    ],
  }));

  return (
    <Animated.View style={styles.container}>
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={index} onPress={onPress} style={styles.tabButton}>
              <Text
                style={{
                  color: isFocused ? "black" : "gray",
                  fontWeight: isFocused ? "bold" : "normal",
                  fontSize: 16,
                }}
              >
                {options.tabBarLabel ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // position: "relative",
    paddingVertical: 10,
    alignItems: "center",
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  underline: {
    position: "absolute",
    height: 4,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    bottom: 4,
    borderRadius: 30,
    width: width / 4,
  },
});

export default CustomTabBar;
