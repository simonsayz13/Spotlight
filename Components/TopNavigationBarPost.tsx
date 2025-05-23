import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ImageType,
  NavigationTabs,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import { RootState } from "../Redux/store";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { addFollower, removeFollower } from "../Firebase/firebaseFireStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const TopNavigationBarPost = ({
  navigation,
  postData,
  onPressPostSetting,
  onPressSharePost,
}: any) => {
  const { userDisplayName, userProfilePic, user_id: userId } = postData;
  const insets = useSafeAreaInsets();
  const { userId: appUserId, userFollowings } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );
  const [isFollowed, setIsFollowed] = useState<boolean>(
    Boolean(
      userFollowings?.find((followingId: string) => followingId === userId)
    )
  );

  const goToProfile = () => {
    navigation.navigate(ProfileStackScreens.ViewProfile, {
      userId,
    });
  };

  const onSettingsClicked = () => {
    onPressPostSetting(true);
  };

  const onShareClicked = () => {
    onPressSharePost(true);
  };

  const handlePressFollowBtn = async () => {
    try {
      await addFollower(userId, appUserId!);
      setIsFollowed(true);
    } catch (error) {
      Alert.alert("Error", `${error}`);
    }
  };

  const handlePressUnfollowBtn = async () => {
    try {
      await removeFollower(userId, appUserId!);
      setIsFollowed(false);
    } catch (error) {
      Alert.alert("Error", `${error}`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.leftWrapper}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </Pressable>
        <Pressable style={styles.userWrapper} onPress={goToProfile}>
          <ProfilePicture
            uri={userProfilePic}
            userDisplayName={userDisplayName}
            type={ImageType.Post}
          />
          <Text style={styles.usernameText}>{userDisplayName}</Text>
        </Pressable>
      </View>

      {userId !== appUserId ? (
        <View style={styles.followShareWrapper}>
          {isFollowed ? (
            <Pressable style={styles.button} onPress={handlePressUnfollowBtn}>
              <Text style={styles.buttonText}>Following</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.button} onPress={handlePressFollowBtn}>
              <Text style={styles.buttonText}>Follow</Text>
            </Pressable>
          )}
          <Pressable onPressIn={onShareClicked}>
            <EvilIcons name="share-apple" size={34} color="black" />
          </Pressable>
        </View>
      ) : (
        <View style={[styles.followShareWrapper, { paddingRight: 6 }]}>
          <Pressable onPressIn={onSettingsClicked}>
            <Feather name="more-horizontal" size={26} color="black" />
          </Pressable>
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
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderColor: ThemeColoursPrimary.LogoColour,
    borderWidth: 0.8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.LogoColour,
  },
});

export default TopNavigationBarPost;
