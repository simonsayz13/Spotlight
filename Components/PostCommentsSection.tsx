import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CommentCard from "./CommentCard";
import { ThemeColoursPrimary } from "../Constants/UI";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const renderCommentsWithReplies = (
  comments: any[],
  navigation: any,
  openKeyboard: any,
  setReplyingTo: any,
  postId: string
) => {
  const renderCommentThread = (
    parentCommentId: string | null,
    isTopLevel: boolean = false
  ) => {
    return comments
      .filter((comment) => comment.parentCommentId === parentCommentId)
      .sort(
        (a, b) =>
          new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
      ) // Sort by timestamp
      .map((comment, index, array) => (
        <View
          style={{ backgroundColor: ThemeColoursPrimary.LightGreyBackground }}
          key={comment.commentId + "_view"}
        >
          {/* Render the comment */}
          <CommentCard
            key={comment.commentId}
            commentData={comment}
            navigation={navigation}
            openKeyboard={openKeyboard}
            setReplyingTo={setReplyingTo}
            reply={!!parentCommentId} // Pass 'reply' prop to style replies differently
            postId={postId}
          />
          {renderCommentThread(comment.commentId)}
          {isTopLevel && <View style={styles.divider} />}
        </View>
      ));
  };
  // Start rendering from the top-level comments (where parentCommentId is null)
  return renderCommentThread(null, true); // Pass 'true' to indicate top-level comments
};

const PostCommentsSection = (props: any) => {
  const {
    comments,
    navigation,
    openKeyboard,
    setReplyingTo,
    postId,
    allowComment,
  } = props;

  if (!allowComment) {
    return (
      <View style={styles.noCommentContainer}>
        <MaterialCommunityIcons
          name="comment-off-outline"
          size={24}
          color="black"
        />
        <Text style={styles.noCommentText}>Comments disabled</Text>
      </View>
    );
  }

  return comments.length > 0 ? (
    <View style={styles.container}>
      <View style={styles.commentCountContainer}>
        <Text style={styles.commentCountText}>Comments {comments.length}</Text>
      </View>
      <View>
        {renderCommentsWithReplies(
          comments,
          navigation,
          openKeyboard,
          setReplyingTo,
          postId
        )}
      </View>
    </View>
  ) : (
    <View style={styles.noCommentContainer}>
      <MaterialCommunityIcons
        name="comment-off-outline"
        size={24}
        color="black"
      />
      <Text style={styles.noCommentText}>
        No comments, be the first to comment!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  commentCountContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 0.6,
    borderColor: ThemeColoursPrimary.SecondaryColour + "20",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentCountText: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontWeight: "500",
    fontSize: 15,
  },
  divider: {
    marginTop: 6,
  },
  noCommentContainer: {
    gap: 6,
    marginTop: 6,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  noCommentText: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontWeight: "500",
  },
});

export default PostCommentsSection;
