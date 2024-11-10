import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  // Animated,
} from "react-native";
import TopNavigationBarPost from "../../Components/TopNavigationBarPost";
import PostInteractionBar from "../../Components/PostInteractionBar";
import MainPost from "../../Components/MainPost";
import { ThemeColoursPrimary } from "../../Constants/UI";
import PostOptions from "../../Components/PostOptions";
import ActivityLoader from "../../Components/ActivityLoader";
import SharePost from "../../Components/SharePost";
import MessageModal from "../../Components/MessageModal";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const Post = ({ navigation, route }: any) => {
  const { postData } = route.params;
  const postInteractionBarRef = useRef<any>(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [bottomHeight, setBottomHeight] = useState(50); // Default height
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOptionsDrawer, setIsOptionsDrawer] = useState(false);
  const [isShareDrawer, setIsShareDrawer] = useState(false);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const overlayOpacity = useSharedValue(0); // Replace with a shared value
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const openKeyboard = () => {
    if (postInteractionBarRef.current)
      postInteractionBarRef.current.showKeyboard();
  };

  const showSettingDrawer = () => {
    setIsDrawerOpen(true);
    overlayOpacity.value = withTiming(1, { duration: 300 });
  };

  const hideSettingDrawer = () => {
    if (postInteractionBarRef.current)
      postInteractionBarRef.current.handleKeyboardDidHide();
    setIsDrawerOpen(false);
    setIsOptionsDrawer(false);
    setIsShareDrawer(false);
    setIsCommentActive(false);
    overlayOpacity.value = withTiming(0, { duration: 300 });
  };

  useEffect(() => {
    if (isOptionsDrawer || isShareDrawer || isCommentActive) {
      showSettingDrawer();
    } else {
      hideSettingDrawer();
    }
  }, [isOptionsDrawer, isShareDrawer, isCommentActive]);

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBarPost
        navigation={navigation}
        postData={postData}
        onPressPostSetting={setIsOptionsDrawer}
        onPressSharePost={setIsShareDrawer}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, overflow: "hidden" }}
      >
        <MainPost
          postData={postData}
          navigation={navigation}
          openKeyboard={openKeyboard}
          setReplyingTo={setReplyingTo}
        />

        <MessageModal
          message={modalMessage} // Adjust this message as needed
          visible={modalVisible}
          setModalVisible={setModalVisible}
        />

        {isDrawerOpen && (
          <Animated.View
            style={[styles.overlay, overlayAnimatedStyle]}
            pointerEvents="auto"
          >
            <TouchableOpacity
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={hideSettingDrawer} // Close drawer on overlay press
            />
          </Animated.View>
        )}

        {!isOptionsDrawer && !isShareDrawer && (
          <View style={[styles.bottomView, { height: bottomHeight }]}>
            <PostInteractionBar
              ref={postInteractionBarRef}
              postData={postData}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              setBottomHeight={setBottomHeight}
              setIsCommentActive={setIsCommentActive}
            />
          </View>
        )}

        {isOptionsDrawer && (
          <PostOptions
            setIsDrawerOpen={setIsOptionsDrawer}
            navigation={navigation}
            setIsLoading={setIsLoading}
            postData={postData}
          />
        )}
        {isShareDrawer && (
          <SharePost
            setIsDrawerOpen={setIsShareDrawer}
            navigation={navigation}
            postData={postData}
            setModalVisible={setModalVisible}
            setModalMessage={setModalMessage}
            isShareDrawer={isShareDrawer}
          />
        )}
        <ActivityLoader indicator={isLoading} text="Deleting" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
    zIndex: 0,
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomView: {},
});
export default Post;
