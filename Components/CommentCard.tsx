import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import { ProfileStackScreens, ThemeColoursPrimary } from "../Constants/UI";
import { formatRelativeTime } from "../Util/utility";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const CommentCard = ({ commentData, navigation }: any) => {
  const { profilePhotoUrl, userId: commentUserId } = commentData;
  const { userId } = useSelector((state: RootState) => state.user);

  const goToProfile = () => {
    navigation.navigate(ProfileStackScreens.Profile, {
      guestView: userId !== commentUserId,
      opId: commentData.userId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <TouchableOpacity style={styles.userWrapper} onPressIn={goToProfile}>
          {profilePhotoUrl ? (
            <Image
              source={{ uri: profilePhotoUrl }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={30}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          )}
          <Text style={styles.userNameFont}>{commentData.displayName}</Text>
        </TouchableOpacity>

        <View style={styles.separatorDot} />
        <Text style={styles.timeStampFont}>
          {formatRelativeTime(commentData.timeStamp)}
        </Text>
      </View>
      <View style={styles.commentContainer}>
        <Text style={styles.commentFont}>{commentData.text}</Text>
      </View>
      <View style={styles.commentActions}>
        <TouchableOpacity style={{ flexDirection: "row", gap: 4 }}>
          <Octicons
            name="reply"
            size={20}
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <Text style={styles.miscFont}>Reply</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <AntDesign
            name={"hearto"}
            size={20}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    gap: 2,
    paddingVertical: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userNameFont: {
    fontSize: 14,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  timeStampFont: {
    fontSize: 12,
  },
  commentContainer: {
    paddingLeft: 2,
    marginVertical: 6,
  },
  separatorDot: {
    height: 3.5,
    width: 3.5,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    borderRadius: 50,
  },
  commentFont: {
    color: ThemeColoursPrimary.SecondaryColour,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
  miscFont: {
    color: ThemeColoursPrimary.SecondaryColour,
  },
  userWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  profileImage: {
    width: 34, // Width and height should be the same
    height: 34,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
});

export default CommentCard;
