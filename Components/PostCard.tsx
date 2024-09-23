import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColoursPrimary } from "../Constants/UI";
import { Image } from "expo-image";
import { fetchUserDetails } from "../Firebase/firebaseFireStore";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const PostCard = ({ title, imageUrl, userId, likes, openPost }: any) => {
  const [displayName, setDisplayName] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const { userDisplayName } = useSelector((state: RootState) => state.user);

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
    <TouchableOpacity style={styles.card} activeOpacity={1} onPress={openPost}>
      {imageUrl ? (
        <Image
          style={styles.image}
          source={{
            uri: imageUrl,
          }}
        />
      ) : (
        <Image
          source={{
            uri: "https://archive.org/download/placeholder-image/placeholder-image.jpg",
          }}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.userLikes}>
          <Text style={styles.userFont}>
            {userId ? displayName : userDisplayName}
          </Text>
          <View style={styles.likes}>
            <AntDesign
              name="hearto"
              size={12}
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <Text style={styles.userFont}>{likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000", // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Similar to elevation height
        shadowOpacity: 0.2, // How transparent the shadow is
        shadowRadius: 4, // The blur or spread radius of the shadow
      },
      android: {
        elevation: 2, // Android's elevation property
      },
    }),
    width: "48%",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  content: {
    padding: 8,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  userFont: {
    fontSize: 12,
    color: ThemeColoursPrimary.SecondaryColour,
    opacity: 0.7,
  },
  userLikes: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.6,
    opacity: 0.7,
  },
});

export default PostCard;
