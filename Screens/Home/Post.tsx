import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import TopNavigationBarPost from "../../Components/TopNavigationBarPost";
import PostInteractionBar from "../../Components/PostInteractionBar";
import MainPost from "../../Components/MainPost";
import { ThemeColoursPrimary } from "../../Constants/UI";
import PostOptions from "../../Components/PostOptions";
import ActivityLoader from "../../Components/ActivityLoader";
import SharePost from "../../Components/SharePost";
import MessageModal from "../../Components/MessageModal";

const Post = ({ navigation, route }: any) => {
  const { postData } = route.params;
  const postInteractionBarRef = useRef<any>(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [bottomHeight, setBottomHeight] = useState(50); // Default height
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOptionsDrawer, setIsOptionsDrawer] = useState(false);
  const [isShareDrawer, setIsShareDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const openKeyboard = () => {
    if (postInteractionBarRef.current) {
      postInteractionBarRef.current.showKeyboard();
    }
  };

  const showSettingDrawer = () => {
    setIsDrawerOpen(true);
    overlayOpacity.setValue(0);
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideSettingDrawer = () => {
    setIsDrawerOpen(false);
    setIsOptionsDrawer(false);
    setIsShareDrawer(false);
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isOptionsDrawer || isShareDrawer) {
      showSettingDrawer();
    } else {
      hideSettingDrawer();
    }
  }, [isOptionsDrawer, isShareDrawer]);

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

      <MessageModal
        message={modalMessage} // Adjust this message as needed
        visible={modalVisible}
        setModalVisible={setModalVisible}
      />

      {isDrawerOpen && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
          pointerEvents="auto"
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={hideSettingDrawer} // Close drawer on overlay press
          />
        </Animated.View>
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
        />
      )}

      <ActivityLoader indicator={isLoading} text="Deleting" />
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
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomView: {},
});
export default Post;
