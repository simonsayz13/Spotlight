import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import {
  NavigationTabs,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { formatRelativeTime } from "../Util/utility";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { toggleLikeComment } from "../Firebase/firebaseFireStore";

const CommentCard = ({
  commentData,
  navigation,
  openKeyboard,
  setReplyingTo,
  postId,
}: any) => {
  const { profilePhotoUrl } = commentData;
  const { userId } = useSelector((state: RootState) => state.user);

  const goToProfile = (commentUserId: string) => {
    userId === commentUserId
      ? navigation.navigate("appUserProfileView")
      : navigation.navigate(ProfileStackScreens.ViewProfile, {
          userId: commentUserId,
        });
  };
  const isLiked = commentData.likes.includes(userId);
  return (
    <View
      style={[
        styles.container,
        { paddingLeft: commentData.parentCommentId ? 50 : 10 },
      ]}
    >
      <View style={styles.userContainer}>
        <TouchableOpacity
          style={styles.userWrapper}
          onPressIn={() => {
            goToProfile(commentData.userId);
          }}
        >
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

        <View style={styles.commentActions}>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            onPressIn={() => {
              setReplyingTo(commentData);
              openKeyboard();
            }}
          >
            <Octicons
              name="reply"
              size={16}
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <Text style={styles.miscFont}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.commentContainer}>
        <View style={styles.comment}>
          {commentData.replyingTo && (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={{ color: "#666" }}>Reply </Text>
              <TouchableOpacity
                onPressIn={() => {
                  goToProfile(commentData.replyingTo.userId);
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: ThemeColoursPrimary.LogoColour,
                    textDecorationLine: "underline",
                  }}
                >
                  {commentData.replyingTo.displayName}
                </Text>
              </TouchableOpacity>
              <Text>: </Text>
            </View>
          )}
          <Text style={styles.commentText}>{commentData.text}</Text>
        </View>
        <TouchableOpacity
          style={{
            position: "absolute", // Set the heart icon's position to absolute
            bottom: 0, // Align it to the bottom of the text container
            right: 0, // Align it to the right side}
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
          onPressIn={() => {
            toggleLikeComment(postId, commentData.commentId, userId!);
          }}
        >
          {commentData.likes.length > 0 && (
            <Text>{commentData.likes.length}</Text>
          )}
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={16}
            color={
              isLiked
                ? ThemeColoursPrimary.LogoColour
                : ThemeColoursPrimary.SecondaryColour
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    gap: 2,
    paddingRight: 10,
    paddingVertical: 6,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userNameFont: {
    fontSize: 14,
    fontWeight: "600",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  timeStampFont: {
    fontSize: 12,
  },
  commentContainer: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  separatorDot: {
    height: 3.5,
    width: 3.5,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    borderRadius: 50,
    opacity: 0.7,
  },
  commentText: {
    color: ThemeColoursPrimary.SecondaryColour,
  },
  comment: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "91%",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
  },
  miscFont: {
    fontSize: 14,
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
