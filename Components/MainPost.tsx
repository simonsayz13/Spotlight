import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import CommentSection from "./CommentSection";
import { mockCommentData } from "../Constants/mockData";

const MainPost = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/test_data/image_laopobaobao.jpg")}
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
        <Text>{mockCommentData.length} Comments</Text>
      </View>

      {/* Comment bar */}
      {/* <View style={styles.commentContainer}>
        <Ionicons name="person-circle-outline" size={44} color="black" />
        <View style={styles.searchBar}>
          <View style={styles.commentStyle}>
            <FontAwesome name="pencil-square-o" size={20} color="black" />
            <TextInput style={styles.input} placeholder="Comment..." />
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <MaterialIcons name="alternate-email" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Octicons name="smiley" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="image" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

      {/* Comment Section */}
      {/* <View> */}
      <CommentSection commentData={mockCommentData} />
      <View style={{ alignItems: "center", paddingTop: 15, paddingBottom: 40 }}>
        <Text>- The end -</Text>
      </View>

      {/* </View> */}
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
  },
  postDescriptionContainer: {
    marginHorizontal: 8,
  },
  postDescriptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  userMetaDataContainer: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  userMetaDataText: {
    fontSize: 11,
    opacity: 0.6,
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
