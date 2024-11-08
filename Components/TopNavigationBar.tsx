import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Animated as RNAnimated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useRef, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColoursPrimary, TopNavigationHomeButtons } from "../Constants/UI";
import { Image } from "expo-image";
import { images } from "../Constants";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const TopNavigationBar = (props: any) => {
  const {
    searchText,
    showSearchBar,
    handleSearchBarChange,
    setContent,
    handlePressSearchBtn,
    handlePressMenuBtn,
    handlePressInClearBtn,
    isMenuVisible,
  } = props;

  const inputRef = useRef<TextInput>(null);
  const [buttonStates, setButtonStates] = useState(TopNavigationHomeButtons);
  const translateY = useSharedValue(-50);
  const [underlinePosition] = useState(
    new RNAnimated.Value(
      width / buttonStates.length +
        (width / buttonStates.length - width / 4) / 2
    )
  );
  const menuButtonTranslateY = useRef(new RNAnimated.Value(0)).current;

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
    RNAnimated.timing(underlinePosition, {
      toValue:
        index * (width / buttonStates.length) +
        (width / buttonStates.length - width / 4) / 2, // width divided by the number of buttons
      duration: 200, // Duration of animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  // Toggle translateY value based on showSearchBar
  useEffect(() => {
    translateY.value = withTiming(showSearchBar ? 0 : -16, { duration: 300 });
  }, [showSearchBar]);
  const animatedStyleSearchBar = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  //> Hooks
  useEffect(() => {
    if (showSearchBar && inputRef?.current) {
      inputRef.current?.focus();
    }
  }, [showSearchBar]);

  useEffect(() => {
    // Animate the menu button view
    RNAnimated.timing(menuButtonTranslateY, {
      toValue: isMenuVisible ? 0 : -50, // Adjust the value to control how much it moves
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  return (
    <View style={{ marginBottom: 2 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePressMenuBtn}>
          <Ionicons
            name={showSearchBar ? "chevron-back" : "menu"}
            size={30}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          {!showSearchBar ? (
            <Image
              source={images.trademark}
              contentFit="contain"
              style={styles.logo}
            />
          ) : (
            <Animated.View
              style={[styles.searchBar, animatedStyleSearchBar]}
              pointerEvents={showSearchBar ? "auto" : "none"}
            >
              <View style={styles.searchBarWrapper}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearchBarChange}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPressIn={handlePressInClearBtn}>
                    <AntDesign name="closecircleo" size={20} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          )}
        </View>
        <TouchableOpacity
          onPress={handlePressSearchBtn}
          style={{ marginLeft: 4 }}
        >
          <Ionicons
            name="search"
            size={28}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
      </View>

      <RNAnimated.View
        style={{
          zIndex: -10,
          transform: [{ translateY: menuButtonTranslateY }],
          height: isMenuVisible ? "auto" : 0, // Adjust height based on visibility
          opacity: menuButtonTranslateY.interpolate({
            inputRange: [-50, 0],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        <View
          style={{
            paddingTop: 4,
            paddingBottom: 6,
            flexDirection: "row",
          }}
        >
          {buttonStates.map((button, index) => (
            <TouchableOpacity
              key={button.id}
              onPress={() => handlePress(button.id, index)}
              style={{ width: width / 3 }}
            >
              <View style={styles.textWrapper}>
                <Text
                  style={
                    button.clicked
                      ? styles.menuButtonClicked
                      : styles.menuButton
                  }
                >
                  {button.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <RNAnimated.View
          style={[
            styles.customUnderline,
            {
              transform: [{ translateX: underlinePosition }], // Move based on animated value
            },
          ]}
        />
      </RNAnimated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
    height: 50,
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#808080",
  },
  menuButtonClicked: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  textWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  customUnderline: {
    position: "absolute",
    bottom: 2, // Adjust this value to control the gap between the text and underline
    height: 3,
    width: width / 4,
    backgroundColor: ThemeColoursPrimary.LogoColour, // Set the underline color
    borderRadius: 20,
    justifyContent: "center",
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  searchBar: {
    width: "100%",
    // position: "absolute",
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 20,
  },
  input: {
    height: 36,
    borderColor: "black",
  },
  logo: {
    width: 200,
    height: 50,
  },
});

export default TopNavigationBar;
