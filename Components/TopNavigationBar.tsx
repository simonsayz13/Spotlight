import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColoursPrimary } from "../Constants/UI";
import { Image } from "expo-image";
import { images } from "../Constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TopNavigationBar = (props: any) => {
  const {
    searchText,
    showSearchBar,
    handleSearchBarChange,
    handlePressSearchBtn,
    handlePressMenuBtn,
    handlePressInClearBtn,
    isDropDownMenuVisible,
  } = props;
  const inputRef = useRef<TextInput>(null);
  const translateY = useSharedValue(-50);

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
      duration: 100,
    });
  }, [isDropDownMenuVisible]);

  const animatedStyleSearchBar = useAnimatedStyle(() => {
    return { transform: [{ translateY: translateY.value }] };
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

        <View style={styles.middleContainer}>
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
  middleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
});

export default TopNavigationBar;
