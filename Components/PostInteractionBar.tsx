import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
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
  hasUserInteractedWithPost,
  getPostMetrics,
} from "../Firebase/firebaseFireStore";
import { FireStoreAction, FireStorePostField } from "../Constants/dbReference";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const PostInteractionBar = ({ postData }: any) => {
  const { userId } = useSelector((state: RootState) => state.user);
  const { likes, comments, favourites } = postData;
  const [inputWidth] = useState(new Animated.Value(200));
  const [inputActive, setInputActive] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentFavourites, setCurrentFavourites] = useState(favourites);

  useFocusEffect(
    useCallback(() => {
      const fetchMetric = async () => {
        try {
          const hasLiked = await hasUserInteractedWithPost(
            userId!,
            FireStorePostField.Likes,
            postData.id
          );
          const hasFavourited = await hasUserInteractedWithPost(
            userId!,
            FireStorePostField.Favourites,
            postData.id
          );
          setLiked(hasLiked);
          setFavourited(hasFavourited);

          const likes = await getPostMetrics(
            postData.id,
            FireStorePostField.Likes
          );
          setCurrentLikes(likes);
          const favourites = await getPostMetrics(
            postData.id,
            FireStorePostField.Favourites
          );
          setCurrentFavourites(favourites);
        } catch (error) {
          console.log("Error fetching user metric on this post");
        }
      };
      fetchMetric();
    }, [])
  );

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
        postData.id,
        FireStorePostField.Likes,
        FireStoreAction.Increment
      );
      setLiked(true);
      setCurrentLikes(currentLikes + 1);
      updateUserPostMetric(
        userId!,
        FireStorePostField.Likes,
        postData.id,
        FireStoreAction.Add
      );
    } else {
      updatePostMetric(
        postData.id,
        FireStorePostField.Likes,
        FireStoreAction.Decrement
      );
      setLiked(false);
      setCurrentLikes(currentLikes - 1);
      updateUserPostMetric(
        userId!,
        FireStorePostField.Likes,
        postData.id,
        FireStoreAction.Remove
      );
    }
  };

  const onClickFavourite = () => {
    if (!favourited) {
      updatePostMetric(
        postData.id,
        FireStorePostField.Favourites,
        FireStoreAction.Increment
      );
      setFavourited(true);
      setCurrentFavourites(currentFavourites + 1);
      updateUserPostMetric(
        userId!,
        FireStorePostField.Favourites,
        postData.id,
        FireStoreAction.Add
      );
    } else {
      updatePostMetric(
        postData.id,
        FireStorePostField.Favourites,
        FireStoreAction.Decrement
      );
      setFavourited(false);
      setCurrentFavourites(currentFavourites - 1);
      updateUserPostMetric(
        userId!,
        FireStorePostField.Favourites,
        postData.id,
        FireStoreAction.Remove
      );
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
              style={styles.input}
              placeholder="Say something..."
              onFocus={handleKeyboardDidShow}
              onBlur={handleKeyboardDidHide}
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
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
            <TouchableOpacity>
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
    justifyContent: "space-between",
  },
  input: {
    height: 20,
    marginLeft: 4,
    fontSize: 16,
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
