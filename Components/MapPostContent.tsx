import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getUserDetails } from "../Firebase/firebaseFireStore";
import { Image } from "expo-image";
import { HomeStackScreens, ThemeColoursPrimary } from "../Constants/UI";
import { formatRelativeTime } from "../Util/utility";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
const MapPostContent = ({ postData, navigation, hideModal }: any) => {
  const {
    title,
    description,
    likes,
    timeStamp,
    user_id: userId,
    id,
    favourites,
    comments,
  } = postData;
  const [userDisplayName, setUserDisplayName] = useState();
  const [userProfilePic, setUserProfilePic] = useState();
  const memoizedPostData = useMemo(() => postData, [postData]);
  const fetchUserDetails = async () => {
    const data = await getUserDetails(userId);
    setUserDisplayName(data!.display_name);
    setUserProfilePic(data!.profile_picture_url);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleExpandPostPress = () => {
    hideModal();
    navigation.navigate(HomeStackScreens.Post, {
      postData: memoizedPostData,
      customAnimation: true,
    }); // Pass postId and any necessary data
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image source={{ uri: userProfilePic }} style={styles.profileImage} />
        <Text style={styles.userNameText}>{userDisplayName}</Text>
        <View style={styles.separatorDot} />
        <Text style={styles.timeStampFont}>
          {formatRelativeTime(timeStamp)}
        </Text>

        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPressIn={handleExpandPostPress}
        >
          <MaterialCommunityIcons name="arrow-expand" size={28} color="black" />
        </TouchableOpacity>
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
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 34, // Width and height should be the same
    height: 34,
    borderRadius: 50, // Half of the width or height for a perfect circle
    marginRight: 4,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "bold",
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
