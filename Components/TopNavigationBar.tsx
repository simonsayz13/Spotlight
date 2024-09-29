import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ThemeColoursPrimary, TopNavigationHomeButtons } from "../Constants/UI";

const TopNavigationBar = (props: any) => {
  const { setContent, drawerHandler } = props;
  const [buttonStates, setButtonStates] = useState(TopNavigationHomeButtons);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [searchBarOpacity] = useState(new Animated.Value(0)); // Start with opacity 0 (invisible)
  const [searchBarTranslateX] = useState(new Animated.Value(10)); // Start with position off-screen

  const handlePress = (id: number) => {
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
  };

  const toggleSearchBar = () => {
    // Toggle the visibility of the search bar
    setShowSearchBar((prev) => !prev);

    // Define the animation
    Animated.parallel([
      Animated.timing(searchBarOpacity, {
        toValue: showSearchBar ? 0 : 1, // Fade out if it's currently visible, fade in otherwise
        duration: showSearchBar ? 0 : 200, // Duration of 300 milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),

      Animated.timing(searchBarTranslateX, {
        toValue: showSearchBar ? 10 : -2, // Move up if it's currently visible, move down otherwise
        duration: showSearchBar ? 0 : 200, // Duration of 300 milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start();
  };

  const fetchNewItem = () => {
    console.log("fetch new item");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showSearchBar ? toggleSearchBar : drawerHandler}
      >
        <Ionicons
          name={showSearchBar ? "chevron-back" : "menu"}
          size={32}
          color={ThemeColoursPrimary.SecondaryColour}
        />
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <Animated.View
          style={[
            styles.searchBar,
            {
              opacity: searchBarOpacity,
              transform: [{ translateX: searchBarTranslateX }],
            },
          ]}
          pointerEvents={showSearchBar ? "auto" : "none"}
        >
          <TextInput style={styles.input} placeholder="Search..." />
        </Animated.View>
        {!showSearchBar &&
          buttonStates.map((button) => (
            <TouchableOpacity
              key={button.id}
              onPress={() => handlePress(button.id)}
            >
              {button.clicked ? (
                <View style={styles.textWrapper}>
                  <Text style={styles.menuButtonClicked}>{button.label}</Text>
                  <View style={styles.customUnderline} />
                </View>
              ) : (
                <Text style={styles.menuButton}>{button.label}</Text>
              )}
            </TouchableOpacity>
          ))}
      </View>
      <TouchableOpacity
        onPress={showSearchBar ? fetchNewItem : toggleSearchBar}
      >
        <Ionicons
          name="search"
          size={32}
          color={ThemeColoursPrimary.SecondaryColour}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  menuButton: {
    fontSize: 20,
    fontWeight: "normal",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  menuButtonClicked: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  textWrapper: {
    position: "relative",
    alignItems: "center",
  },
  customUnderline: {
    position: "absolute",
    bottom: -4, // Adjust this value to control the gap between the text and underline
    height: 3,
    width: "70%",
    backgroundColor: ThemeColoursPrimary.LogoColour, // Set the underline color
    borderRadius: 18,
  },
  searchBar: {
    flexGrow: 1,
    width: "100%",
    position: "absolute",
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 20,
    // borderColor: ThemeColours.PrimaryColour,
    borderWidth: 2,
  },
  input: {
    height: 36,
    borderColor: "black",
    paddingHorizontal: 10,
  },
});

export default TopNavigationBar;
