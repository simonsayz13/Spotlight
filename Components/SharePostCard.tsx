import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  HomeStackScreens,
  ImageType,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import NoPhotoPlaceHolder from "./NoPhotoPlaceHolder";
import ProfilePicture from "./ProfilePicture";
import { Image as ExpoImage } from "expo-image";
import { getPostById, getUserDetails } from "../Firebase/firebaseFireStore";

const SharePostCard = ({ postId, navigation }: any) => {
  const { userDisplayName: appUserDisplayName } = useSelector(
    (state: RootState) => state.user
  );
  const [postData, setPostData] = useState<any>();

  const openPost = () => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  const retrievePost = async () => {
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
    retrievePost();
  }, []);

  return postData ? (
    <Pressable style={styles.card} onPress={openPost}>
      {postData.media[0]?.media_url ? (
        <ExpoImage
          style={[styles.image]} // Dynamic height
          source={{
            uri: postData.media[0]?.media_url,
          }}
          contentFit="cover"
        />
      ) : (
        <NoPhotoPlaceHolder
          title={postData.title}
          description={postData.description}
        />
      )}

      <View style={styles.content}>
        {postData.media[0]?.media_url && (
          <Text style={styles.title}>{postData.title}</Text>
        )}
        <View style={styles.cardDetails}>
          <ProfilePicture
            uri={postData.userProfilePic}
            userDisplayName={
              self ? appUserDisplayName : postData.userDisplayName
            }
            type={ImageType.PostCard}
          />
          <Text style={styles.userFont}>{postData.userDisplayName}</Text>
        </View>
      </View>
    </Pressable>
  ) : (
    <View
      style={{ height: 239.3, backgroundColor: "white", borderRadius: 4 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 4,
    width: "100%", // Adjust the width to fit multiple cards in a row
  },
  image: {
    width: "100%", // Ensure the image takes up full width
    height: 180,
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
});

export default SharePostCard;
