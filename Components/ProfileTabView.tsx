import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { ThemeColoursPrimary } from "../Constants/UI";
import TabIcon from "./TabIcon";
import UserPostContents from "./ProfileContentViews/UserPostContent";
import UserLikedContents from "./ProfileContentViews/UserLikedContent";
import UserFavouritedContents from "./ProfileContentViews/UserFavouritedContent";
const { width, height } = Dimensions.get("window");

const ProfileTabView = () => {
  const initialLayout = { width, height };
  const [index, setIndex] = useState(0); // State to manage current tab
  const [routes] = useState([
    {
      key: "posts",
      iconName: "grid",
      iconLibrary: "Ionicons",
    },
    {
      key: "likes",
      iconName: "heart",
      iconLibrary: "AntDesign",
      colour: "#FF0000",
    },
    {
      key: "favourited",
      iconName: "star",
      iconLibrary: "AntDesign",
      size: 24,
      colour: ThemeColoursPrimary.GoldColour,
    },
  ]);

  const renderScene = SceneMap({
    posts: UserPostContents,
    likes: UserLikedContents,
    favourited: UserFavouritedContents,
  });

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        renderIcon={({ route }: any) => (
          <TabIcon
            iconName={route.iconName}
            iconLibrary={route.iconLibrary}
            size={route.size}
            colour={route.colour}
          />
        )}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
      />
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
      sceneContainerStyle={styles.sceneContainerStyle}
      lazy
    />
  );
};

const styles = StyleSheet.create({
  sceneContainerStyle: {
    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
  },
  tabBar: {
    marginTop: -14,
    height: 41,
    backgroundColor: "white",
    justifyContent: "center", // Vertically center content
  },
  indicator: {
    backgroundColor: ThemeColoursPrimary.LogoColour,
    width: 70,
    left: (width / 3 - 70) / 2,
    height: 3,
    borderRadius: 10,
    bottom: 1,
  },
});

export default ProfileTabView;
