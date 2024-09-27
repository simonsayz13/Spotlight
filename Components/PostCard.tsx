import React, { useCallback, useEffect, useState } from "react";
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
import {
  fetchUserDetails,
  getPostMetrics,
  hasUserInteractedWithPost,
} from "../Firebase/firebaseFireStore";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { useFocusEffect } from "@react-navigation/native";
import { FireStorePostField } from "../Constants/dbReference";

const PostCard = ({ postData, openPost, self }: any) => {
  const [displayName, setDisplayName] = useState("");
  const { userDisplayName, userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );
  const { title, user_id: userId, likes } = postData;

  const [currentLikes, setCurrentLikes] = useState(likes);
  const [liked, setLiked] = useState(false);

  const imageUrl = postData.media[0].media_url;
  useFocusEffect(
    useCallback(() => {
      const fetchPostData = async () => {
        const hasLiked = await hasUserInteractedWithPost(
          currentUserId!,
          FireStorePostField.Likes,
          postData.id
        );
        setLiked(hasLiked);

        const likes = await getPostMetrics(
          postData.id,
          FireStorePostField.Likes
        );
        setCurrentLikes(likes);
      };

      fetchPostData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const userDetails = await fetchUserDetails(userId);
      setDisplayName(userDetails?.display_name);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={1}
      onPress={() => {
        openPost(postData);
      }}
    >
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
            {self ? userDisplayName : displayName}
          </Text>
          <View style={styles.likes}>
            <AntDesign
              name={liked ? "heart" : "hearto"}
              size={12}
              color={
                liked
                  ? ThemeColoursPrimary.LogoColour
                  : ThemeColoursPrimary.SecondaryColour
              }
            />
            <Text style={styles.userFont}>{currentLikes}</Text>
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
