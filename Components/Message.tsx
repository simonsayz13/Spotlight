import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ThemeColoursPrimary } from "../Constants/UI";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const { width: windowWidth } = Dimensions.get("window");

const Message = React.memo(({ message, profilePicUrl }: any) => {
  const { userId: currentUserId, userProfilePhotoURL } = useSelector(
    (state: RootState) => state.user
  );

  const isHeader = message.type === "header";
  const isTime = message.type === "time";

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
        </>
      )}
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 10,
    color: ThemeColoursPrimary.SecondaryColour,
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
});

export default Message;
