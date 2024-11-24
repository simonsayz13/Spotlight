import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import React from "react";
import FollowButton from "./FollowButton";
import ProfilePicture from "./ProfilePicture";
import { ImageType } from "../Constants/UI";

const FollowerRow = ({
  followerObj,
  buttonTitle,
  buttonDisabled,
  handlePressButton,
  handlePressProfile,
}) => {
  const { display_name, profile_picture_url } = followerObj;

  return (
    <View style={styles.container}>
      <Pressable style={styles.profileContainer} onPress={handlePressProfile}>
        <ProfilePicture
          type={ImageType.Contacts}
          uri={profile_picture_url}
          userDisplayName={display_name}
        />
        <Text style={styles.displayName}>{display_name}</Text>
      </Pressable>
      <View style={{ flexGrow: 1 }} />
      {!buttonDisabled && (
        <FollowButton title={buttonTitle} handlePress={handlePressButton} />
      )}
    </View>
  );
};

export default FollowerRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 6, // Adds 10 units of padding to the top and bottom
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  displayName: {
    fontSize: 16,
  },
});
