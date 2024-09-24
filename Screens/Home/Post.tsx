import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import TopNavigationBarPost from "../../Components/TopNavigationBarPost";
import PostInteractionBar from "../../Components/PostInteractionBar";
import MainPost from "../../Components/MainPost";
import { ThemeColoursPrimary } from "../../Constants/UI";

const Post = ({ navigation, route }: any) => {
  const { postData } = route.params;
  const userId = postData.user_id;
  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBarPost navigation={navigation} userId={userId} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "padding"}
        style={styles.container}
      >
        <MainPost postData={postData} />
        <View style={styles.bottomView}>
          <PostInteractionBar />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  bottomView: {
    height: 60,
  },
});
export default Post;
