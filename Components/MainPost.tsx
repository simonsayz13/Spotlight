import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { mockCommentData } from "../Constants/mockData";
import { ThemeColours, ThemeColoursPrimary } from "../Constants/UI";
import CommentCard from "./CommentCard";

const MainPost = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/test_image/image_laopobaobao.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.postContentContainer}>
        <View style={styles.postTitleContainer}>
          <Text style={styles.postTitleText}>好想婆宝宝怎么办啊啊啊</Text>
        </View>
        <View style={styles.postDescriptionContainer}>
          <Text style={styles.postDescriptionText}>爱你哦😗</Text>
        </View>
        <View style={styles.userMetaDataContainer}>
          <Text style={styles.userMetaDataText}>
            Edited on 09-05 United Kingdom
          </Text>
        </View>
      </View>

      {/* Comment Count */}
      <View style={styles.commentCountContainer}>
        <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
          {mockCommentData.length} Comments
        </Text>
      </View>

      {/* Comment Section */}
      <View>
        {mockCommentData.map((comment: any) => (
          <CommentCard key={comment.id} commentData={comment} />
        ))}
      </View>

      <View style={{ alignItems: "center", paddingTop: 15, paddingBottom: 40 }}>
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
    height: 400,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  postTitleContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  postTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  postDescriptionContainer: {
    marginHorizontal: 8,
  },
  postDescriptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  userMetaDataContainer: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  userMetaDataText: {
    fontSize: 11,
    opacity: 0.6,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  postContentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    marginHorizontal: 8,
  },
  commentCountContainer: {
    marginTop: 6,
    marginHorizontal: 16,
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
});
export default MainPost;
