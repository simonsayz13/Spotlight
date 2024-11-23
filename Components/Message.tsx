import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  HomeStackScreens,
  ImageType,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import ProfilePicture from "./ProfilePicture";
import PostCard from "./PostCard";
import { getPostById, getUserDetails } from "../Firebase/firebaseFireStore";

const { width: windowWidth } = Dimensions.get("window");

const SharePostMessage = memo(
  ({ postData, openPost, message, currentUserId }: any) => {
    const marginStyle = {
      marginLeft: message.senderId === currentUserId ? 0 : 4,
      marginRight: message.senderId === currentUserId ? 4 : 0,
    };
    return (
      <View>
        <View style={[styles.postCardContainer, marginStyle]}>
          <PostCard postId={postData.id} openPost={openPost} />
        </View>
        {message.text !== "" && (
          <View
            style={[
              styles.postMessageContainer,
              marginStyle,
              {
                backgroundColor:
                  message.senderId === currentUserId
                    ? ThemeColoursPrimary.LogoColour
                    : "#e5e5ea",
                alignSelf:
                  message.senderId === currentUserId
                    ? "flex-end"
                    : "flex-start",
              },
            ]}
          >
            <Text
              style={[
                styles.postMessageText,
                {
                  color:
                    message.senderId === currentUserId
                      ? ThemeColoursPrimary.PrimaryColour
                      : ThemeColoursPrimary.SecondaryColour,
                },
              ]}
            >
              {message.text}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

const Message = React.memo(
  ({ message, profilePicUrl, userDisplayName, navigation }: any) => {
    const {
      userId: currentUserId,
      userProfilePhotoURL,
      userDisplayName: appUserDisplayName,
    } = useSelector((state: RootState) => state.user);

    const isHeader = message.type === "header";
    const isTime = message.type === "time";
    const [postData, setPostData] = useState<any>();

    const openPost = (postData: any) => {
      navigation.navigate(HomeStackScreens.Post, {
        postData,
      });
    };

    const retrievePost = async (postId: string) => {
      const post = await getPostById(postId);
      const userDetails: any = await getUserDetails(post.user_id); // Assuming user_id is available in post
      setPostData({
        ...post,
        id: postId,
        userDisplayName: userDetails.display_name,
        userProfilePic: userDetails.profile_picture_url,
      });
    };

    useEffect(() => {
      if (message.postId) {
        retrievePost(message.postId);
      } else {
        setPostData(null); // Reset postData if no postId
      }
    }, [message]);

    return (
      <View
        key={message.id + message.timestamp}
        style={[
          styles.messageContainer,
          {
            flexDirection:
              isHeader || isTime
                ? "column"
                : message.senderId === currentUserId
                ? "row-reverse"
                : "row",
            alignSelf:
              isHeader || isTime
                ? "center"
                : message.senderId === currentUserId
                ? "flex-end"
                : "flex-start",
          },
        ]}
      >
        {isHeader && <Text style={styles.timeStampText}>{message.text}</Text>}
        {isTime && <Text style={styles.timeStampText}>{message.text}</Text>}
        {!isHeader && !isTime && (
          <>
            <ProfilePicture
              uri={
                message.senderId === currentUserId
                  ? userProfilePhotoURL!
                  : profilePicUrl
              }
              userDisplayName={
                message.senderId === currentUserId
                  ? appUserDisplayName
                  : userDisplayName
              }
              type={ImageType.Post}
            />

            {postData ? (
              <SharePostMessage
                postData={postData}
                openPost={openPost}
                message={message}
                currentUserId={currentUserId}
              />
            ) : (
              <Text
                style={[
                  styles.messageText,
                  {
                    backgroundColor:
                      message.senderId === currentUserId
                        ? ThemeColoursPrimary.LogoColour
                        : "#e5e5ea",
                    color:
                      message.senderId === currentUserId
                        ? ThemeColoursPrimary.PrimaryColour
                        : ThemeColoursPrimary.SecondaryColour,
                    marginLeft: message.senderId === currentUserId ? 0 : 4,
                    marginRight: message.senderId === currentUserId ? 4 : 0,
                  },
                ]}
              >
                {message.text}
              </Text>
            )}
          </>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    width: windowWidth * 0.6,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  messageText: {
    padding: 10,
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 10,
    overflow: "hidden",
  },
  timeStampText: {
    fontSize: 10,
    color: "#555",
    marginTop: 6, // Space to avoid crowding the messages
  },
  chatProfileImage: {
    width: 40, // Width and height should be the same
    height: 40,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
  postCardContainer: { width: windowWidth * 0.5 },
  postMessageContainer: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    fontWeight: "500",
    maxWidth: "80%",
  },
  postMessageText: {
    fontSize: 14,
    fontWeight: "500",
    overflow: "hidden",
  },
});

export default Message;
