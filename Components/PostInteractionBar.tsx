import React, {
  forwardRef,
  useCallback,
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
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColoursPrimary } from "../Constants/UI";
import {
  updateUserPostMetric,
  updatePostMetric,
  addCommentToPost,
  addReplyToComment,
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

const screenWidth = Dimensions.get("window").width;
const PostInteractionBar = forwardRef(
  ({ postData, replyingTo, setReplyingTo }: any, ref) => {
    const {
      userId,
      userLiked,
      userFavourites,
      userDisplayName,
      userProfilePhotoURL,
    } = useSelector((state: RootState) => state.user);
    const { likes, comments, favourites, id: postId } = postData;
    const [inputWidth] = useState(new Animated.Value(screenWidth * 0.5));
    const [inputActive, setInputActive] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [currentFavourites, setCurrentFavourites] = useState(favourites);
    const [commentInput, setCommentInput] = useState<string>("");
    //@ts-ignore
    const liked = userLiked.includes(postId);
    //@ts-ignore
    const favourited = userFavourites.includes(postId);

    const textInputRef = useRef<TextInput>(null);

    const showKeyboard = () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
      setInputActive(true);
      Animated.timing(inputWidth, {
        toValue: screenWidth - 16, // Full width when the keyboard is open (adjust based on screen size)
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    useImperativeHandle(ref, () => ({
      showKeyboard,
      handleKeyboardDidHide,
    }));

    const handleKeyboardDidHide = () => {
      Animated.timing(inputWidth, {
        toValue: 200, // Initial width when the keyboard is closed
        duration: 300,
        useNativeDriver: false,
      }).start();
      setInputActive(false);
      setReplyingTo(null);
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
        store.dispatch(
          removeUserLiked({ [FireStorePostField.PostID]: postId })
        );
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
      } catch (error) {
        Alert.alert("Error", "Error posting reply");
      }
    };

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.commentBar, { width: inputWidth }]}>
          <View style={styles.commentStyle}>
            <FontAwesome
              name="pencil-square-o"
              size={20}
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder={
                replyingTo
                  ? `Replying to ${replyingTo.displayName}`
                  : "Add a comment"
              }
              onFocus={showKeyboard}
              onBlur={handleKeyboardDidHide}
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
              returnKeyType="send"
              onChangeText={(text) => setCommentInput(text)}
              onSubmitEditing={replyingTo ? handleReply : handlePostComment}
            />
          </View>
        </Animated.View>
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
              <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
                {currentLikes}
              </Text>
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
              <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
                {currentFavourites}
              </Text>
            </View>
            <View style={styles.actionWrapper}>
              <TouchableOpacity onPressIn={showKeyboard}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={28}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </TouchableOpacity>
              <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
                {comments.length}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Platform.OS === "ios" ? 14 : 8,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 20,
    justifyContent: "space-between",
  },
  commentBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    borderColor: ThemeColoursPrimary.SecondaryColour,
    borderWidth: 1.2,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    height: 34,
    marginLeft: 8,
  },
  input: {
    height: 18,
    marginLeft: 4,
    fontSize: 16,
    width: screenWidth * 0.8,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  actionWrapper: {
    width: 54,
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  commentStyle: { flexDirection: "row" },
  iconContainer: {
    flexDirection: "row",
    paddingRight: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostInteractionBar;
