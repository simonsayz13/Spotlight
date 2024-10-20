import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ProfileStackScreens, ThemeColoursPrimary } from "../Constants/UI";
import { getUserDetails } from "../Firebase/firebaseFireStore";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FollowTabsHeader from "./FollowTabsHeader";

const TopNavigationBarPost = ({
  navigation,
  userId,
  displayName,
  activeTab,
  handleTabPress,
}: any) => {
  const [profilePicUrl, setProfilePicUrl] = useState("");

  const goToProfile = () => {
    navigation.navigate(ProfileStackScreens.Profile, {
      guestView: true,
      opId: userId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.userWrapper} onPressIn={goToProfile}>
          <Text style={styles.usernameText}>{displayName}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <FollowTabsHeader activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
  },
  leftWrapper: {
    width: "100%",
    flexDirection: "row", // Align children in a row
    alignItems: "center", // Vertically center the content
    justifyContent: "flex-start",
  },
  textWrapper: {
    position: "relative",
    alignItems: "center",
  },
  userWrapper: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  usernameText: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 18,
    marginLeft: 10,
  },
  followShareWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginRight: 10,
  },
  profileImage: {
    width: 40, // Width and height should be the same
    height: 42,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
});

export default TopNavigationBarPost;
