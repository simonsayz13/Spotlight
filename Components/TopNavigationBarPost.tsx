import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ThemeColoursPrimary } from "../Constants/UI";
import { fetchUserDetails } from "../Firebase/firebaseFireStore";
import { Image } from "expo-image";
const TopNavigationBarPost = ({ navigation, userId }: any) => {
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [displayName, setDisplayName] = useState("");

  const fetchUserData = async () => {
    try {
      const userDetails = await fetchUserDetails(userId);
      setDisplayName(userDetails?.display_name);
      setProfilePicUrl(userDetails?.profile_picture_url);
    } catch (error) {}
  };
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <View style={styles.userWrapper}>
          <Image
            source={
              profilePicUrl
                ? { uri: profilePicUrl }
                : require("../assets/test_image/mock_profile_picture.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.usernameText}>{displayName}</Text>
        </View>
      </View>
      <View style={styles.followShareWrapper}>
        <TouchableOpacity>
          <SimpleLineIcons
            name="user-follow"
            size={28}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome
            name="share-square-o"
            size={28}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
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
    marginLeft: 10,
  },
  followShareWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginRight: 10,
  },
  profileImage: {
    width: 40, // Width and height should be the same
    height: 42,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
});

export default TopNavigationBarPost;
