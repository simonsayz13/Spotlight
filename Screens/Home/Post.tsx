import React, { useEffect, useRef, useState } from "react";
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
  const postInteractionBarRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [bottomHeight, setBottomHeight] = useState(50); // Default height
  const openKeyboard = () => {
    if (postInteractionBarRef.current) {
      //@ts-ignore
      postInteractionBarRef.current.showKeyboard();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBarPost navigation={navigation} postData={postData} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <MainPost
          postData={postData}
          navigation={navigation}
          openKeyboard={openKeyboard}
          setReplyingTo={setReplyingTo}
        />
        <View style={[styles.bottomView, { height: bottomHeight }]}>
          <PostInteractionBar
            ref={postInteractionBarRef}
            postData={postData}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            setBottomHeight={setBottomHeight}
          />
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
  bottomView: {},
});
export default Post;
