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
import { useFocusEffect } from "@react-navigation/native";

const Post = ({ navigation }: any) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: null });
    }, [navigation])
  );

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
  },
  bottomView: {
    height: 60,
  },
});
export default Post;
