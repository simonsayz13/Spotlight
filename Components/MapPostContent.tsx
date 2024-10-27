import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  HomeStackScreens,
  ImageType,
  NavigationTabs,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { formatRelativeTime } from "../Util/utility";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
const MapPostContent = ({ postData, navigation, hideModal }: any) => {
  const { userId: appUserId } = useSelector((state: RootState) => {
    return state.user;
  });
  const {
    title,
    description,
    likes,
    timeStamp,
    favourites,
    comments,
    userDisplayName,
    userProfilePic,
    user_id,
  } = postData;
  const memoizedPostData = useMemo(() => postData, [postData]);

  const handleExpandPostPress = () => {
    hideModal();
    navigation.navigate(HomeStackScreens.Post, {
      postData: memoizedPostData,
      customAnimation: true,
    }); // Pass postId and any necessary data
  };

  const handleUserProfilePress = () => {
    hideModal();
    console.log(postData);
    appUserId === user_id
      ? navigation.navigate(NavigationTabs.Me)
      : navigation.navigate(ProfileStackScreens.ViewProfile, {
          userId: user_id,
        });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity
          style={styles.userInfoContainer}
          activeOpacity={1}
          onPressIn={handleUserProfilePress}
        >
          <ProfilePicture
            uri={userProfilePic}
            userDisplayName={userDisplayName}
            type={ImageType.MapPost}
          />
          <Text style={styles.userNameText}>{userDisplayName}</Text>
        </TouchableOpacity>
        <View style={styles.separatorDot} />
        <Text style={styles.timeStampFont}>
          {formatRelativeTime(timeStamp)}
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity>
            <MaterialIcons
              name="directions"
              size={30}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
          <TouchableOpacity onPressIn={handleExpandPostPress}>
            <MaterialCommunityIcons
              name="arrow-expand"
              size={28}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <Text
        style={styles.descriptionText}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {description}
      </Text>

      <View style={styles.engagementRow}>
        <View style={styles.engagementItem}>
          <AntDesign
            name={"heart"}
            size={20}
            color={ThemeColoursPrimary.LogoColour}
          />
          <Text style={styles.engagementText}>{likes}</Text>
        </View>
        <View style={styles.engagementItem}>
          <AntDesign
            name={"star"}
            size={21}
            color={ThemeColoursPrimary.GoldColour}
          />
          <Text style={styles.engagementText}>{favourites}</Text>
        </View>

        <View style={styles.engagementItem}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={21}
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <Text style={styles.engagementText}>{comments.length}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  actionsContainer: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  separatorDot: {
    height: 3.5,
    width: 3.5,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    borderRadius: 50,
    marginHorizontal: 4,
  },
  timeStampFont: {
    fontSize: 12,
    opacity: 0.7,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 4,
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 4,
    height: 40,
  },
  engagementRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  engagementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  engagementText: {
    marginLeft: 2,
    fontSize: 14,
  },
});

export default MapPostContent;
