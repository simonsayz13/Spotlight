import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useRef, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColoursPrimary, TopNavigationHomeButtons } from "../Constants/UI";
import { Image } from "expo-image";
import { images } from "../Constants";
import Animated, {
  interpolate,
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
    isDropDownMenuVisible,
  } = props;
  const inputRef = useRef<TextInput>(null);
  const [buttonStates, setButtonStates] = useState(TopNavigationHomeButtons);
  const translateY = useSharedValue(-50);
  const underlinePosition = useSharedValue(
    width / buttonStates.length + (width / buttonStates.length - width / 4) / 2
  );
  const dropdownHeight = useSharedValue(0);

  //> Hooks
  useEffect(() => {
    if (showSearchBar && inputRef?.current) {
      inputRef.current?.focus();
    }
    translateY.value = withTiming(showSearchBar ? 0 : -16, { duration: 300 });
  }, [showSearchBar]);

  useEffect(() => {
    dropdownHeight.value = withTiming(isDropDownMenuVisible ? 30 : 0, {
      duration: 300,
    });
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
    // // Animate underline to the new tab
    underlinePosition.value = withTiming(
      index * (width / buttonStates.length) +
        (width / buttonStates.length - width / 4) / 2,
      { duration: 100 }
    );
  };

  const animatedStyleSearchBar = useAnimatedStyle(() => {
    return { transform: [{ translateY: translateY.value }] };
  });

  const animatedMenuStyle = useAnimatedStyle(() => {
    const opacity = interpolate(dropdownHeight.value, [0, 30], [0, 1], "clamp");
    return {
      opacity,
      height: dropdownHeight.value,
      backgroundColor: ThemeColoursPrimary.PrimaryColour,
    };
  });

  const menuStyle = {
    zIndex: isDropDownMenuVisible ? 0 : -10,
    marginBottom: isDropDownMenuVisible ? 4 : 0,
  };

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    const opacity = interpolate(dropdownHeight.value, [0, 30], [0, 1], "clamp");
    return {
      opacity,
      transform: [{ translateX: underlinePosition.value }],
    };
  });

  return (
    <View>
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
                  onSubmitEditing={handlePressSearchBtn}
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

      {!showSearchBar && (
        <Animated.View style={[animatedMenuStyle, menuStyle]}>
          <View style={styles.buttonContainer}>
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
          <Animated.View
            style={[styles.customUnderline, animatedUnderlineStyle]}
          />
        </Animated.View>
      )}
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
    zIndex: 100,
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
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 20,
  },
  input: {
    width: "95%",
    height: 36,
    borderColor: "black",
  },
  logo: {
    width: 200,
    height: 50,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 3,
    flexDirection: "row",
    paddingVertical: 4,
    zIndex: 0,
  },
});

export default TopNavigationBar;
