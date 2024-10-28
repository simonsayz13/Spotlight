import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ImageType,
  NavigationTabs,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import { RootState } from "../Redux/store";
import Feather from "@expo/vector-icons/Feather";

const TopNavigationBarPost = ({
  navigation,
  postData,
  onPressPostSetting,
}: any) => {
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
          <ProfilePicture
            uri={userProfilePic}
            userDisplayName={userDisplayName}
            type={ImageType.Post}
          />
          <Text style={styles.usernameText}>{userDisplayName}</Text>
        </TouchableOpacity>
      </View>

      {userId !== appUserId ? (
        <View style={styles.followShareWrapper}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1}>
            <FontAwesome6
              name="arrow-up-right-from-square"
              size={24}
              color={ThemeColoursPrimary.LogoColour}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.followShareWrapper}>
          <TouchableOpacity onPressIn={onPressPostSetting} activeOpacity={1}>
            <Feather name="more-horizontal" size={26} color="black" />
          </TouchableOpacity>
        </View>
      )}
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
