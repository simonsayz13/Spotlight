import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import FollowButton from "./FollowButton";

const FollowerRow = ({
  followerObj,
  buttonTitle,
  buttonDisabled,
  handlePressButton,
  handlePressProfile,
}) => {
  const { display_name, profile_picture_url, user_id } = followerObj;

  return (
    <View style={styles.container}>
      <Pressable style={styles.profileContainer} onPress={handlePressProfile}>
        {profile_picture_url ? (
          <Image source={{ uri: profile_picture_url }} style={styles.image} />
        ) : (
          <View style={styles.defaultImage} />
        )}
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
    paddingVertical: 5, // Adds 10 units of padding to the top and bottom
    paddingHorizontal: 10,
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    marginRight: 10,
    width: 60,
    height: 60,
    borderRadius: 50, // Optional: Make the corners of the image rounded
  },
  defaultImage: {
    marginRight: 10,
    width: 60,
    height: 60,
    borderRadius: 50, // Optional: Make the corners of the image rounded
    backgroundColor: "#ccc",
  },
  displayName: {
    fontSize: 16,
  },
});
