import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { ThemeColoursPrimary } from "../Constants/UI";
import CommentCard from "./CommentCard";
import { formatRelativeTime } from "../Util/utility";
import { useSelector } from "react-redux";
import { selectCommentsByPostId } from "../Redux/Selectors/postSelector";
import ImageCarousel from "./ImageCarousel";

const MainPost = ({
  postData,
  navigation,
  openKeyboard,
  setReplyingTo,
}: any) => {
  const { title, description, timeStamp, id: postId } = postData;

  const comments = useSelector(selectCommentsByPostId(postId));
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      overScrollMode="never"
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
        <View style={styles.userMetaDataContainer}>
          <Text style={styles.userMetaDataText}>
            Posted {formatRelativeTime(timeStamp)}
          </Text>
        </View>
      </View>

      {/* Comment Count */}
      {comments.length > 0 ? (
        <View>
          <View style={styles.commentCountContainer}>
            <Text
              style={{
                color: ThemeColoursPrimary.SecondaryColour,
                fontWeight: "500",
              }}
            >
              Comments
            </Text>
          </View>
          <View>
            {comments.map((comment: any) => (
              <View key={comment.commentId + "_view"}>
                <CommentCard
                  key={comment.commentId}
                  commentData={comment}
                  navigation={navigation}
                  openKeyboard={openKeyboard}
                  setReplyingTo={setReplyingTo}
                  reply={false}
                />
                {comment.replies &&
                  comment.replies.map((reply: any) => (
                    <CommentCard
                      key={reply.replyId}
                      commentData={reply}
                      navigation={navigation}
                      openKeyboard={openKeyboard}
                      setReplyingTo={setReplyingTo}
                      reply={true}
                    />
                  ))}
                <View style={styles.divider} />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.commentCountContainer}>
          <Text
            style={{
              color: ThemeColoursPrimary.SecondaryColour,
              fontWeight: "500",
            }}
          >
            No comments
          </Text>
        </View>
      )}

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
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    marginVertical: 6,
    height: 11,
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
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginHorizontal: 14,
  },
  commentCountContainer: {
    marginTop: 6,
    marginHorizontal: 14,
  },
  searchBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1.2,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    height: 36,
    justifyContent: "space-between",
  },
  input: {
    height: 20,
    marginLeft: 4,
    fontSize: 16,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  iconContainer: {
    flexDirection: "row",
    paddingRight: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  commentStyle: { flexDirection: "row" },

  divider: {
    borderBottomWidth: 0.6,
    borderColor: ThemeColoursPrimary.SecondaryColour + "20",
    marginHorizontal: 14,
  },
});
export default MainPost;
