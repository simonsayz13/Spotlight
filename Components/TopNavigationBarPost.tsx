import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NavigationTabs,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSelector } from "react-redux";
const TopNavigationBarPost = ({ navigation, postData }: any) => {
  const { userDisplayName, userProfilePic, user_id: userId } = postData;
  const { userId: appUserId } = useSelector((state: RootState) => {
    return state.user;
  });
  const goToProfile = () => {
    userId === appUserId
      ? navigation.navigate(NavigationTabs.Me)
      : navigation.navigate(ProfileStackScreens.ViewProfile, {
          userId,
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
        <TouchableOpacity style={styles.userWrapper} onPress={goToProfile}>
          {userProfilePic ? (
            <Image
              source={{ uri: userProfilePic }}
              style={styles.profileImage}
            />
          ) : (
            <FontAwesome6 name="circle-user" size={40} color="black" />
          )}

          <Text style={styles.usernameText}>{userDisplayName}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.followShareWrapper}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome6
            name="arrow-up-right-from-square"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
  },
  leftWrapper: {
    flexDirection: "row", // Align children in a row
    alignItems: "center", // Vertically center the content
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
    fontWeight: "500",
    marginLeft: 8,
  },
  followShareWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginRight: 10,
  },
  profileImage: {
    width: 40, // Width and height should be the same
    height: 42,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
  button: {
    padding: 8,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
});

export default TopNavigationBarPost;
