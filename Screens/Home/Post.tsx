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

const Post = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBarPost navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "padding"}
        style={styles.container}
      >
        <MainPost />
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
