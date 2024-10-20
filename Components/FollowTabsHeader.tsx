import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TopNavigationBarFollows from "./TopNavigationBarFollows";

const FollowTabsHeader = ({
  activeTab,
  onTabPress,
  navigation,
  displayName,
}) => {
  return (
    <View style={styles.tabContainer}>
      <TopNavigationBarFollows
        navigation={navigation}
        displayName={displayName}
      />
      <TouchableOpacity
        onPress={() => onTabPress("Following")}
        style={styles.tabButton}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Following" ? styles.activeTab : null,
          ]}
        >
          Following
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabPress("Followers")}
        style={styles.tabButton}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Followers" ? styles.activeTab : null,
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
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default FollowTabsHeader;
