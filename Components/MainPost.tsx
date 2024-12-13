import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Tags, ThemeColoursPrimary } from "../Constants/UI";
import { formatRelativeTime } from "../Util/utility";
import { useSelector } from "react-redux";
import { selectCommentsByPostId } from "../Redux/Selectors/postSelector";
import ImageCarousel from "./ImageCarousel";
import PostAdBar from "./PostAdBar";
import PostCommentsSection from "./PostCommentsSection";

const MainPost = ({
  postData,
  navigation,
  openKeyboard,
  setReplyingTo,
}: any) => {
  const {
    title,
    description,
    timeStamp,
    id: postId,
    isComment: allowComment,
    tags,
  } = postData;
  const [hideAd, setHideAd] = useState(false);
  const comments = useSelector(selectCommentsByPostId(postId));
  const onClickCloseAd = () => {
    setHideAd((prev) => !prev);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {postData.media.length > 0 && <ImageCarousel images={postData.media} />}
      <View style={styles.postContentContainer}>
        <View style={styles.postTitleContainer}>
          <Text style={styles.postTitleText}>{title}</Text>
        </View>
        {description && (
          <View style={styles.postDescriptionContainer}>
            <Text style={styles.postDescriptionText}>{description}</Text>
          </View>
        )}
        {tags && (
          <View style={styles.tagsContainer}>
            <View style={styles.tagsView}>
              {tags.map((tag: any) => {
                const postTag = Tags.find((t) => t.label === tag); // Fixed equality check
                if (!postTag) return null; // Ensure `postTag` exists
                return (
                  <View
                    key={postTag.id} // Use a unique identifier for the key
                    style={[
                      styles.tagChip,
                      { backgroundColor: postTag.colour },
                    ]}
                  >
                    <Text style={styles.tagText}>
                      {postTag.icon} {postTag.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        <View style={styles.userMetaDataContainer}>
          <Text style={styles.userMetaDataText}>
            Posted {formatRelativeTime(timeStamp)}
          </Text>
        </View>
      </View>

      {!hideAd && <PostAdBar onClickClose={onClickCloseAd} />}

      <PostCommentsSection
        comments={comments}
        navigation={navigation}
        openKeyboard={openKeyboard}
        setReplyingTo={setReplyingTo}
        postId={postId}
        allowComment={allowComment}
      />

      <View
        style={{ alignItems: "center", paddingTop: 30, paddingBottom: 400 }}
      >
        <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
          - The end -
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  image: {
    width: "100%",
  },
  postTitleContainer: {
    marginVertical: 8,
  },
  postTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  postDescriptionContainer: {},
  postDescriptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  userMetaDataContainer: {
    marginTop: 8,
    marginBottom: 6,
  },
  userMetaDataText: {
    fontSize: 11,
    opacity: 0.6,
    color: ThemeColoursPrimary.SecondaryColour,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  postContentContainer: {
    paddingHorizontal: 10,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  tagsContainer: {
    marginTop: 10,
  },
  tagsView: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    color: ThemeColoursPrimary.PrimaryColour,
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default MainPost;
