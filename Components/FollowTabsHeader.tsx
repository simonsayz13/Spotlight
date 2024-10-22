import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TopNavigationBarFollows from "./TopNavigationBarFollows";
import { FollowStackScreens, ThemeColoursPrimary } from "../Constants/UI";

const FollowTabsHeader = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={() => onTabPress(FollowStackScreens.FollowingList)}
        style={[
          styles.tabButton,
          activeTab === FollowStackScreens.FollowingList
            ? styles.activeTab
            : null,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === FollowStackScreens.FollowingList
              ? styles.activeTabText
              : null,
          ]}
        >
          Following
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabPress(FollowStackScreens.FollowerList)}
        style={[
          styles.tabButton,
          activeTab === FollowStackScreens.FollowerList
            ? styles.activeTab
            : null,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === FollowStackScreens.FollowerList
              ? styles.activeTabText
              : null,
          ]}
        >
          Followers
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    width: "50%",
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#000",
  },
  activeTab: {
    borderBottomColor: ThemeColoursPrimary.LogoColour,
    borderBottomWidth: 2,
    height: 30,
    paddingBottom: 5,
  },
});

export default FollowTabsHeader;
