import React, { useCallback, useEffect, useRef, useState } from "react";
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
const PostInteractionBar = ({ postData }: any) => {
  const {
    userId,
    userLiked,
    userFavourites,
    userDisplayName,
    userProfilePhotoURL,
  } = useSelector((state: RootState) => state.user);
  const { likes, comments, favourites, id: postId } = postData;
  const [inputWidth] = useState(new Animated.Value(200));
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
  };

  const handleKeyboardDidShow = () => {
    setInputActive(true);
    Animated.timing(inputWidth, {
      toValue: screenWidth - 16, // Full width when the keyboard is open (adjust based on screen size)
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleKeyboardDidHide = () => {
    Animated.timing(inputWidth, {
      toValue: 200, // Initial width when the keyboard is closed
      duration: 300,
      useNativeDriver: false,
    }).start();
    setInputActive(false);
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
      await addCommentToPost(
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

  return (
    <View style={styles.container}>
      <View>
        <Animated.View style={[styles.searchBar, { width: inputWidth }]}>
          <View style={styles.commentStyle}>
            <FontAwesome
              name="pencil-square-o"
              size={20}
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder="Say something..."
              onFocus={handleKeyboardDidShow}
              onBlur={handleKeyboardDidHide}
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
              returnKeyType="send"
              onChangeText={(text) => setCommentInput(text)}
              onSubmitEditing={handlePostComment}
            />
          </View>
          {inputActive && (
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <MaterialIcons
                  name="alternate-email"
                  size={22}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Octicons
                  name="smiley"
                  size={20}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome
                  name="image"
                  size={20}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
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
            <TouchableOpacity
              onPressIn={() => {
                showKeyboard();
                handleKeyboardDidShow();
              }}
            >
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Platform.OS === "ios" ? 14 : 8,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 20,
  },
  searchBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    borderColor: ThemeColoursPrimary.SecondaryColour,
    borderWidth: 1.2,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    height: 40,
    marginVertical: 6,
    // justifyContent: "space-between",
  },
  input: {
    height: 20,
    marginLeft: 4,
    fontSize: 16,
    width: screenWidth * 0.6,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Platform.OS === "ios" ? 14 : 4,
  },
  actionWrapper: {
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
