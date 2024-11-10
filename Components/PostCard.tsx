import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ImageType, ThemeColoursPrimary } from "../Constants/UI";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import NoPhotoPlaceHolder from "./NoPhotoPlaceHolder";
import ProfilePicture from "./ProfilePicture";

const PostCard = React.memo(({ postData, openPost }: any) => {
  const { userDisplayName: appUserDisplayName, userLiked } = useSelector(
    (state: RootState) => state.user
  );
  const {
    title,
    likes,
    id: postId,
    userProfilePic,
    description,
    userDisplayName,
  } = postData;

  const imageUrl = postData.media[0]?.media_url;

  //@ts-ignore
  const liked = userLiked.includes(postId);

  const imageHeight =
    (postData.media[0]?.height / postData.media[0]?.width) * 150;

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
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <NoPhotoPlaceHolder title={title} description={description} />
      )}

      <View style={styles.content}>
        {imageUrl && <Text style={styles.title}>{title}</Text>}
        <View style={styles.cardDetails}>
          <ProfilePicture
            uri={userProfilePic}
            userDisplayName={self ? appUserDisplayName : userDisplayName}
            type={ImageType.PostCard}
          />
          <Text style={styles.userFont}>{userDisplayName}</Text>
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
