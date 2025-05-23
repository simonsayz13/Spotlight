import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Alert,
  Keyboard,
  Platform,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemeColoursPrimary } from "../Constants/UI";
import TopNavigationBar from "../Components/TopNavigationBar";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPostsBySearch } from "../Firebase/firebaseFireStore";
import { fetchUserDetailOnPosts } from "../Util/Services";
import Content from "../Components/Content";
import TopTabBar from "../Components/TopTabBar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import PostSearchView from "../Components/PostSearchView";
import { appendPosts } from "../Redux/Slices/postsSlices";
import EmptyContent from "../Components/EmptyContent";
const Tab = createMaterialTopTabNavigator();

const PlaceHolderScreen = () => (
  <View
    style={{
      flex: 1,
      paddingTop: 40,
      backgroundColor: ThemeColoursPrimary.LightGreyBackground,
    }}
  >
    <EmptyContent />
  </View>
);

const HomeTopTabNavigation = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isDropDownMenuVisible, setIsDropDownMenuVisible] = useState(true);
  const [searchPostResult, setSearchPostResult] = useState<Array<any>>([]);
  const otherUsers = useSelector((state: RootState) => state.otherUsers);
  const lastScrollY = useRef(0);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const handleSearchBarChange = (
    evt: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (evt?.nativeEvent?.text != null) setSearchText(evt.nativeEvent.text);
  };

  const fetchPostsBySearch = async (searchText: string = "") => {
    try {
      const fetchedPost = await getPostsBySearch(searchText);
      const postsWithUserDetails = await fetchUserDetailOnPosts(
        fetchedPost,
        otherUsers,
        dispatch
      );
      dispatch(appendPosts(postsWithUserDetails));
      postsWithUserDetails.length === 0
        ? setSearchPostResult(["notFound"])
        : setSearchPostResult(postsWithUserDetails);
    } catch (error) {
      Alert.alert("Oops", "Could not fetch any posts");
    }
  };

  const fetchNewItem = () => {
    if (searchText.trim() === "") return;
    fetchPostsBySearch(searchText);
    Keyboard.dismiss();
  };

  const handlePressSearchBtn = () => {
    showSearchBar ? fetchNewItem() : setShowSearchBar(true);
    setIsDropDownMenuVisible(false);
  };

  const handlePressMenuBtn = () => {
    showSearchBar
      ? setShowSearchBar((prev: boolean) => !prev)
      : navigation.toggleDrawer();
    setSearchPostResult([]);
    setIsDropDownMenuVisible(true);
  };

  const handlePressInClearBtn = () => {
    setSearchText(""); // Reset the searchText state
    setSearchPostResult([]);
  };

  useEffect(() => {
    if (!showSearchBar) {
      setSearchText("");
    }
  }, [showSearchBar]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < 0) {
      return;
    }
    if (lastScrollY.current - offsetY > 20) {
      setIsDropDownMenuVisible(true);
    } else if (offsetY - lastScrollY.current > 20) {
      setIsDropDownMenuVisible(false);
    }
    lastScrollY.current = offsetY;
  };

  const translateY = useSharedValue(isDropDownMenuVisible ? 0 : -50); // Initial position (hidden)
  const paddingTop = useSharedValue(
    isDropDownMenuVisible ? (Platform.OS === "android" ? 50 : 40) : 0
  );

  useEffect(() => {
    translateY.value = isDropDownMenuVisible ? 0 : -50; // Animate up when hidden
    paddingTop.value = isDropDownMenuVisible
      ? Platform.OS === "android"
        ? 50
        : 40
      : 0;
  }, [isDropDownMenuVisible]);

  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(translateY.value, { duration: 200 }), // Smooth animation
      },
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(paddingTop.value, { duration: 200 }),
    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopNavigationBar
        searchText={searchText}
        showSearchBar={showSearchBar}
        handleSearchBarChange={handleSearchBarChange}
        handlePressSearchBtn={handlePressSearchBtn}
        handlePressMenuBtn={handlePressMenuBtn}
        handlePressInClearBtn={handlePressInClearBtn}
        isDropDownMenuVisible={isDropDownMenuVisible}
        navigation={navigation}
      />
      <View style={styles.contentWrapper}>
        <View style={{ flex: 1 }}>
          <PostSearchView
            visible={showSearchBar}
            postData={searchPostResult}
            searchText={searchText}
            navigation={navigation}
          />
          <Tab.Navigator
            tabBar={(props: any) => (
              <Animated.View
                style={[
                  styles.tabContainer,
                  animatedTabBarStyle, // Apply animated height
                ]}
              >
                <TopTabBar {...props} />
              </Animated.View>
            )}
            initialRouteName="Discover"
          >
            <Tab.Screen
              name="Following"
              options={{
                tabBarLabel: "Following",
              }}
            >
              {() => (
                <Animated.View
                  style={[styles.contentWrapper, animatedContentStyle]}
                >
                  <Content
                    navigation={navigation}
                    onScroll={handleScroll}
                    content={"following"}
                    setIsDropDownMenuVisible={setIsDropDownMenuVisible}
                  />
                </Animated.View>
              )}
            </Tab.Screen>

            <Tab.Screen name="Discover" options={{ tabBarLabel: "Discover" }}>
              {() => (
                <Animated.View
                  style={[styles.contentWrapper, animatedContentStyle]}
                >
                  <Content
                    navigation={navigation}
                    onScroll={handleScroll}
                    content={"discover"}
                    setIsDropDownMenuVisible={setIsDropDownMenuVisible}
                  />
                </Animated.View>
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Trending"
              component={PlaceHolderScreen}
              options={{ tabBarLabel: "Trending" }}
            />
          </Tab.Navigator>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  contentWrapper: {
    flex: 1,
  },
  tabContainer: {
    position: "absolute", // Absolute positioning removes it from layout flow
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it's above other content
  },
});

export default HomeTopTabNavigation;
