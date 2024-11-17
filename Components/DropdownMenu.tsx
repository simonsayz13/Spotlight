import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemeColoursPrimary, TopNavigationHomeButtons } from "../Constants/UI";

const { width } = Dimensions.get("window");

const DropdownMenu = (props: any) => {
  const { isDropDownMenuVisible, setContent } = props;

  const [buttonStates, setButtonStates] = useState(TopNavigationHomeButtons);
  const translateY = useSharedValue(-50); // Initial hidden position (-50)
  const underlinePosition = useSharedValue(
    width / buttonStates.length + (width / buttonStates.length - width / 4) / 2
  );
  // Update translateY when visibility changes
  useEffect(() => {
    translateY.value = isDropDownMenuVisible ? 0 : -50; // 0 for visible, -50 for hidden
  }, [isDropDownMenuVisible]);

  const handlePress = (id: number, index: number) => {
    setButtonStates((prevStates) =>
      prevStates.map((button) =>
        button.id === id
          ? button.clicked
            ? button
            : { ...button, clicked: true }
          : { ...button, clicked: false }
      )
    );
    const clickedScreen = buttonStates.find((item) => id == item.id)?.label;
    setContent(clickedScreen);
    // Animate underline to the new tab
    underlinePosition.value = withTiming(
      index * (width / buttonStates.length) +
        (width / buttonStates.length - width / 4) / 2,
      { duration: 100 }
    );
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 150, // Smooth transition
          }),
        },
      ],
    };
  });

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: underlinePosition.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.buttonContainer}>
        {buttonStates.map((button, index) => (
          <Pressable
            key={button.id}
            onPress={() => handlePress(button.id, index)}
            style={{ width: width / 3 }}
          >
            <View style={styles.textWrapper}>
              <Text
                style={
                  button.clicked ? styles.menuButtonClicked : styles.menuButton
                }
              >
                {button.label}
              </Text>
            </View>
          </Pressable>
        ))}
        <Animated.View
          style={[styles.customUnderline, animatedUnderlineStyle]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 34,
    zIndex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  customUnderline: {
    position: "absolute",
    bottom: -4, // Adjust this value to control the gap between the text and underline
    height: 3,
    width: width / 4,
    backgroundColor: ThemeColoursPrimary.LogoColour, // Set the underline color
    borderRadius: 50,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  menuButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#808080",
  },
  menuButtonClicked: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  textWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DropdownMenu;
