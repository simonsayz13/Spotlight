import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ImageType, ThemeColoursPrimary } from "../Constants/UI";
import { Image } from "expo-image";
import { getUserDetails } from "../Firebase/firebaseFireStore";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import NoPhotoPlaceHolder from "./NoPhotoPlaceHolder";
import ProfilePicture from "./ProfilePicture";

const PostCard = React.memo(({ postData, openPost, self }: any) => {
  const [displayName, setDisplayName] = useState("");
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const { userDisplayName, userLiked } = useSelector(
    (state: RootState) => state.user
  );
  const {
    title,
    user_id: userId,
    likes,
    id: postId,
    userProfilePic,
    description,
  } = postData;

  const imageUrl = postData.media[0]?.media_url;

  //@ts-ignore
  const liked = userLiked.includes(postId);

  const fetchUserData = async () => {
    try {
      const userDetails = await getUserDetails(userId);
      //@ts-ignore
      setDisplayName(userDetails?.display_name);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Image load handler
  const onImageLoad = (event: any) => {
    const { width, height } = event.source;
    const calculatedHeight = (height / width) * 150;
    setImageHeight(calculatedHeight);
  };

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
          style={[styles.image, { height: imageHeight }]} // Dynamic height
          source={{
            uri: imageUrl,
          }}
          onLoad={onImageLoad} // Set image height after load
        />
      ) : (
        <NoPhotoPlaceHolder title={title} description={description} />
      )}

      <View style={styles.content}>
        {imageUrl && <Text style={styles.title}>{title}</Text>}
        <View style={styles.cardDetails}>
          <ProfilePicture
            uri={userProfilePic}
            userDisplayName={self ? userDisplayName : displayName}
            type={ImageType.PostCard}
          />
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
            <Text style={styles.userFont}>{likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
    width: "100%", // Adjust the width to fit multiple cards in a row
  },
  image: {
    width: "100%", // Ensure the image takes up full width
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
    marginLeft: 4,
  },
  cardDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  likes: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 1.6,
    opacity: 0.7,
  },
});

export default PostCard;
