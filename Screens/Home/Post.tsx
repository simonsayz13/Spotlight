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
  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBarPost navigation={navigation} postData={postData} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <MainPost postData={postData} navigation={navigation} />
        <View style={styles.bottomView}>
          <PostInteractionBar postData={postData} />
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
