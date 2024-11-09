import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColoursPrimary } from "../Constants/UI";
import {
  updateUserPostMetric,
  updatePostMetric,
  addCommentOrReply,
} from "../Firebase/firebaseFireStore";
import { FireStoreAction, FireStorePostField } from "../Constants/dbReference";
import { useSelector } from "react-redux";
import store, { RootState } from "../Redux/store";
import {
  decrementFavourites,
  decrementLikes,
  incrementFavourites,
  incrementLikes,
} from "../Redux/Slices/postsSlices";
import {
  setUserLiked,
  removeUserLiked,
  setUserFavourites,
  removeUserFavourites,
} from "../Redux/Slices/userSlice";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("window").width;
const PostInteractionBar = forwardRef((props: any, ref) => {
  const {
    postData,
    replyingTo,
    setReplyingTo,
    setBottomHeight,
    setIsCommentActive,
  } = props;
  const {
    userId,
    userLiked,
    userFavourites,
    userDisplayName,
    userProfilePhotoURL,
  } = useSelector((state: RootState) => state.user);
  const { likes, comments, favourites, id: postId } = postData;
  const inputWidth = useSharedValue(screenWidth * 0.5);
  const [inputActive, setInputActive] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentFavourites, setCurrentFavourites] = useState(favourites);
  const [commentInput, setCommentInput] = useState<string>("");
  //@ts-ignore
  const liked = userLiked.includes(postId);
  //@ts-ignore
  const favourited = userFavourites.includes(postId);
  const [inputHeight, setInputHeight] = useState(34);
  const textInputRef = useRef<TextInput>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Set to false after first render
      return;
    }
    if (commentInput) {
      inputWidth.value = withTiming(screenWidth - 76, { duration: 100 });
    } else if (inputActive && !commentInput) {
      inputWidth.value = withTiming(screenWidth - 16, { duration: 100 });
    }
  }, [commentInput]);

  const showKeyboard = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
    setInputActive(true);
    setIsCommentActive(true);
    inputWidth.value = withTiming(screenWidth - 16, { duration: 200 });
  };

  const animatedInputWidth = useAnimatedStyle(() => ({
    width: inputWidth.value,
  }));

  useImperativeHandle(ref, () => ({
    showKeyboard,
    handleKeyboardDidHide,
  }));

  const handleKeyboardDidHide = () => {
    inputWidth.value = withTiming(screenWidth * 0.5, { duration: 200 });
    setInputActive(false);
    setReplyingTo(null);
    setBottomHeight(50);
    setCommentInput("");
    setIsCommentActive(false);
    Keyboard.dismiss();
  };

  const onClickLike = () => {
    if (!liked) {
      updatePostMetric(
        postId,
        FireStorePostField.Likes,
        FireStoreAction.Increment
      );
      updateUserPostMetric(
        userId!,
        FireStorePostField.Likes,
        postId,
        FireStoreAction.Add
      );
      store.dispatch(incrementLikes({ [FireStorePostField.PostID]: postId }));
      setCurrentLikes(currentLikes + 1);
      store.dispatch(setUserLiked({ [FireStorePostField.PostID]: postId }));
    } else {
      updatePostMetric(
        postId,
        FireStorePostField.Likes,
        FireStoreAction.Decrement
      );
      updateUserPostMetric(
        userId!,
        FireStorePostField.Likes,
        postId,
        FireStoreAction.Remove
      );
      store.dispatch(decrementLikes({ [FireStorePostField.PostID]: postId }));
      setCurrentLikes(currentLikes - 1);
      store.dispatch(removeUserLiked({ [FireStorePostField.PostID]: postId }));
    }
  };

  const onClickFavourite = () => {
    if (!favourited) {
      updatePostMetric(
        postId,
        FireStorePostField.Favourites,
        FireStoreAction.Increment
      );
      updateUserPostMetric(
        userId!,
        FireStorePostField.Favourites,
        postId,
        FireStoreAction.Add
      );
      store.dispatch(
        incrementFavourites({ [FireStorePostField.PostID]: postId })
      );
      setCurrentFavourites(currentFavourites + 1);
      store.dispatch(
        setUserFavourites({ [FireStorePostField.PostID]: postId })
      );
    } else {
      updatePostMetric(
        postId,
        FireStorePostField.Favourites,
        FireStoreAction.Decrement
      );

      updateUserPostMetric(
        userId!,
        FireStorePostField.Favourites,
        postId,
        FireStoreAction.Remove
      );
      store.dispatch(
        decrementFavourites({ [FireStorePostField.PostID]: postId })
      );
      setCurrentFavourites(currentFavourites - 1);
      store.dispatch(
        removeUserFavourites({ [FireStorePostField.PostID]: postId })
      );
    }
  };

  const handlePostComment = async () => {
    try {
      await addCommentOrReply(
        postId,
        userId!,
        userDisplayName!,
        userProfilePhotoURL!,
        commentInput
      );
      if (textInputRef.current) {
        textInputRef.current.clear();
        setCommentInput(""); // Also clear the state if you're managing it
      }
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Error", "Error posting comment");
    }
  };

  const handleReply = async () => {
    try {
      await addCommentOrReply(
        postId,
        userId!,
        userDisplayName!,
        userProfilePhotoURL!,
        commentInput,
        replyingTo.commentId,
        replyingTo.parentCommentId
          ? { userId: replyingTo.userId, displayName: replyingTo.displayName }
          : null
      );
      if (textInputRef.current) {
        textInputRef.current.clear();
        setCommentInput(""); // Also clear the state if you're managing it
      }
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Error", "Error posting reply");
    }
  };

  return (
    <View
      style={[styles.container, { gap: Platform.OS === "android" ? 4 : 0 }]}
    >
      <Animated.View
        style={[styles.commentBar, animatedInputWidth, { height: inputHeight }]}
      >
        <View style={styles.commentStyle}>
          <TextInput
            multiline={true}
            ref={textInputRef}
            style={styles.input}
            placeholder={
              replyingTo
                ? `Replying to ${replyingTo.displayName}`
                : "Add a comment"
            }
            onFocus={showKeyboard}
            onBlur={handleKeyboardDidHide}
            onChangeText={(text) => setCommentInput(text)}
            onContentSizeChange={(event) => {
              const { contentSize } = event.nativeEvent; // Correctly accessing the contentSize
              if (contentSize) {
                setInputHeight(Math.min(contentSize.height + 20, 100)); // Add extra padding
                if (Math.min(contentSize.height + 20, 100) < 50)
                  setBottomHeight(50);
                if (Math.min(contentSize.height + 20, 100) > 50)
                  setBottomHeight(Math.min(contentSize.height + 30, 110));
              }
            }}
          />
        </View>
      </Animated.View>

      {Boolean(commentInput) && inputActive && (
        <TouchableOpacity
          style={styles.button}
          onPressIn={replyingTo ? handleReply : handlePostComment}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      )}
      {!inputActive && (
        <View style={styles.actionsContainer}>
          <View style={styles.actionWrapper}>
            <TouchableOpacity onPressIn={onClickLike}>
              <AntDesign
                name={liked ? "heart" : "hearto"}
                size={28}
                color={
                  liked
                    ? ThemeColoursPrimary.LogoColour
                    : ThemeColoursPrimary.SecondaryColour
                }
              />
            </TouchableOpacity>
            <Text style={styles.metricText}>{currentLikes}</Text>
          </View>
          <View style={styles.actionWrapper}>
            <TouchableOpacity onPressIn={onClickFavourite}>
              <AntDesign
                name={favourited ? "star" : "staro"}
                size={28}
                color={
                  favourited
                    ? ThemeColoursPrimary.GoldColour
                    : ThemeColoursPrimary.SecondaryColour
                }
              />
            </TouchableOpacity>
            <Text style={styles.metricText}>{currentFavourites}</Text>
          </View>
          <View style={styles.actionWrapper}>
            <TouchableOpacity onPressIn={showKeyboard}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            </TouchableOpacity>
            <Text style={styles.metricText}>{comments.length}</Text>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 10,
  },
  commentBar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    marginLeft: 8,
  },
  input: {
    width: "100%", // Full width
    color: "#333",
    fontSize: 16, // Font size
    paddingVertical: 0, // Reset default padding
    paddingHorizontal: 4, // Add horizontal padding
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  actionWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  metricText: {
    color: ThemeColoursPrimary.SecondaryColour,
    minWidth: 24,
  },
  commentStyle: { flexDirection: "row" },
  iconContainer: {
    flexDirection: "row",
    paddingRight: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 8,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 39,
    marginLeft: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
});

export default PostInteractionBar;
