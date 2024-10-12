import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { formatRelativeTime } from "../Util/utility";
import { ThemeColoursPrimary } from "../Constants/UI";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const { width: windowWidth } = Dimensions.get("window");

const Message = React.memo(({ message, profilePicUrl }: any) => {
  const { userId: currentUserId, userProfilePhotoURL } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <View
      key={message.id + message.timestamp}
      style={[
        styles.messageContainer,
        {
          flexDirection:
            message.senderId === currentUserId ? "row-reverse" : "row",
          alignSelf:
            message.senderId === currentUserId ? "flex-end" : "flex-start", // Snap to right or left
        },
      ]}
    >
      {!userProfilePhotoURL && !profilePicUrl ? (
        <Image
          source={require("../assets/test_image/mock_profile_picture.png")}
          style={styles.chatProfileImage}
        />
      ) : (
        <Image
          source={
            message.senderId === currentUserId
              ? {
                  uri: userProfilePhotoURL!,
                }
              : profilePicUrl
              ? { uri: profilePicUrl }
              : require("../assets/test_image/mock_profile_picture.png")
          }
          style={styles.chatProfileImage}
        />
      )}

      <Text
        style={[
          styles.messageText,
          {
            marginLeft: message.senderId === currentUserId ? 0 : 4,
            marginRight: message.senderId === currentUserId ? 4 : 0,
          },
        ]}
      >
        {message.text}
      </Text>
      <View style={styles.timeStampContainer}>
        <Text style={styles.timeStampText}>
          {formatRelativeTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
});

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
    padding: 6,
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 8,
    borderWidth: 1.3,
    borderColor: ThemeColoursPrimary.SecondaryColour,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    color: ThemeColoursPrimary.SecondaryColour,
    overflow: "hidden",
  },
  timeStampContainer: {
    padding: 6, // Optional: Add some padding
  },
  timeStampText: { fontSize: 10, color: ThemeColoursPrimary.SecondaryColour },
  chatProfileImage: {
    width: 40, // Width and height should be the same
    height: 40,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
});

export default Message;
