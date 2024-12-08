import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import TopNavigationBarPost from "../../Components/TopNavigationBarPost";
import PostInteractionBar from "../../Components/PostInteractionBar";
import MainPost from "../../Components/MainPost";
import { ThemeColoursPrimary } from "../../Constants/UI";
import PostOptions from "../../Components/PostOptions";
import SharePost from "../../Components/SharePost";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Post = ({ navigation, route }: any) => {
  const { postData } = route.params;
  const postInteractionBarRef = useRef<any>(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOptionsDrawer, setIsOptionsDrawer] = useState(false);
  const [isShareDrawer, setIsShareDrawer] = useState(false);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          backgroundColor: ThemeColoursPrimary.LightGreyBackground,
        }}
      >
        <TopNavigationBarPost
          navigation={navigation}
          postData={postData}
          onPressPostSetting={setIsOptionsDrawer}
          onPressSharePost={setIsShareDrawer}
        />
        {isDrawerOpen && (
          <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
            <Pressable
              style={styles.overlayTouchable}
              onPress={hideSettingDrawer} // Close drawer on overlay press
            />
          </Animated.View>
        )}

        <MainPost
          postData={postData}
          navigation={navigation}
          openKeyboard={openKeyboard}
          setReplyingTo={setReplyingTo}
        />

        {!isOptionsDrawer && !isShareDrawer && (
          <PostInteractionBar
            ref={postInteractionBarRef}
            postData={postData}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            setIsCommentActive={setIsCommentActive}
          />
        )}

        {isOptionsDrawer && (
          <PostOptions
            setIsDrawerOpen={setIsOptionsDrawer}
            navigation={navigation}
            postData={postData}
          />
        )}
        {isShareDrawer && (
          <SharePost
            setIsDrawerOpen={setIsShareDrawer}
            navigation={navigation}
            postData={postData}
            isShareDrawer={isShareDrawer}
          />
        )}
      </KeyboardAvoidingView>
    </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
});
export default Post;
