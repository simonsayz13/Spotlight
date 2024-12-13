import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  FollowStackScreens,
  Gender,
  guestContentSelectorButtons,
  HomeStackScreens,
  ImageType,
  MessagingStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import PostCard from "../../Components/PostCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserDetails,
  getPostsByUserId,
  addFollower,
  removeFollower,
} from "../../Firebase/firebaseFireStore";
import { MasonryFlashList } from "@shopify/flash-list";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProfilePicture from "../../Components/ProfilePicture";
import ImageModal from "../../Components/ImageModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appendPosts } from "../../Redux/Slices/postsSlices";
import {
  getTotalLikesForUserPosts,
  getTotalNumberOfPosts,
} from "../../Firebase/FirebaseUsers";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import EmptyContent from "../../Components/EmptyContent";
import Loader from "../../Components/Loader";

const ViewProfile = ({ navigation, route }: any) => {
  const { userId: appUserId, userFollowings: appUserFollowings } = useSelector(
    (state: RootState) => state.user
  );
  const [buttonStates, setButtonStates] = useState(guestContentSelectorButtons);
  const userId = route?.params?.userId;
  const [profileUserId, setProfileUserId] = useState(null);
  const [postsData, setPostsData] = useState<Array<any>>([]);
  const [displayName, setDisplayName] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [ldgUserDetails, setLdgUserDetails] = useState(false);
  const [ldgSuccUserDetails, setLdgSuccUserDetails] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [userLikesCount, setUserLikesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const heightAnim = useSharedValue(200);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [ldgContentComplete, setLdgContentComplete] = useState(false);

  useEffect(() => {
    if (ldgSuccUserDetails) {
      heightAnim.value = withTiming(250, { duration: 200 });
    }
  }, [ldgSuccUserDetails]);

  useEffect(() => {
    if (ldgUserDetails) {
      heightAnim.value = withTiming(216, { duration: 200 });
    }
  }, [ldgUserDetails]);

  const animatedStyleHeight = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
    };
  });

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPostsByUserId(userId);
      const postsWithUserDetails = await Promise.all(
        fetchedPosts.map(async (post: any) => {
          const userDetails = await getUserDetails(post.user_id); // Assuming user_id is available in post
          return {
            ...post,
            userDisplayName: userDetails.display_name,
            userProfilePic: userDetails.profile_picture_url,
          };
        })
      );
      setPostsData(postsWithUserDetails);
      dispatch(appendPosts(postsWithUserDetails));
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    } finally {
      setLdgContentComplete(true);
    }
  };

  const fetchUser = async () => {
    setLdgUserDetails(true);
    setLdgSuccUserDetails(false);
    try {
      const likesCount = await getTotalLikesForUserPosts(userId!);
      const postsCount = await getTotalNumberOfPosts(userId!);
      const {
        user_id,
        profile_picture_url,
        display_name,
        biography,
        gender,
        followers,
        followings,
      }: any = await getUserDetails(userId!);
      setPostsCount(postsCount);
      setUserLikesCount(likesCount);
      setDisplayName(display_name);
      setProfilePicUrl(profile_picture_url);
      setBio(biography);
      setGender(gender);
      setFollowers(followers);
      setFollowings(followings);
      setProfileUserId(user_id);
      followers?.find((followerId: string) => followerId === appUserId) &&
        setIsFollowed(true);
      setLdgUserDetails(false);
      setLdgSuccUserDetails(true);
    } catch (error) {
      setLdgUserDetails(false);
      Alert.alert("Error", `${error}`);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, [userId]);

  const handlePress = (id: number) => {
    setButtonStates((prevStates) =>
      prevStates.map((button) =>
        button.id === id
          ? button.clicked
            ? button
            : { ...button, clicked: true }
          : { ...button, clicked: false }
      )
    );
  };

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  const openChat = () => {
    navigation.navigate(MessagingStackScreens.Chat, {
      userId,
      userName: displayName,
      profilePicUrl,
    });
  };

  const handlePressFollowBtn = async () => {
    try {
      await addFollower(profileUserId, appUserId);
      setIsFollowed(true);
      setFollowers([...followers, appUserId]);
    } catch (error) {
      Alert.alert("Error", `${error}`);
    }
  };

  const handlePressUnfollowBtn = async () => {
    try {
      await removeFollower(profileUserId, appUserId);
      setIsFollowed(false);

      const arr = followers?.filter(
        (followerUserId) => followerUserId !== appUserId
      );
      setFollowers(arr);
    } catch (error) {
      Alert.alert("Error", `${error}`);
    }
  };

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const openFollowerScreen = (tabIndex) => {
    navigation.navigate("FollowStack", {
      screen: FollowStackScreens.FollowerList,
      params: {
        displayName,
        followers,
        followings,
        profileId: userId,
        appUserId,
        tabIndex: tabIndex,
        appUserFollowings,
        type: "profileUser",
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setLdgContentComplete(false);
    fetchUser();
    fetchPosts();
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postId={item.id} openPost={openPost} navigation={navigation} />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "android" ? insets.top + 10 : insets.top,
        },
      ]}
    >
      {Boolean(profilePicUrl) && (
        <ImageModal
          imageUri={profilePicUrl}
          isGalleryVisible={isGalleryVisible}
          setIsGalleryVisible={setIsGalleryVisible}
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[ThemeColoursPrimary.LogoColour]} // Optional: Refresh spinner color
          />
        }
      >
        <Animated.View style={animatedStyleHeight}>
          <View style={styles.profileDetails}>
            <View style={styles.profilePicBackButtonContainer}>
              <Pressable
                onPress={handleBackButtonPress}
                style={styles.backButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </Pressable>
              <ProfilePicture
                uri={profilePicUrl}
                userDisplayName={displayName}
                type={ImageType.Profile}
                onPressFunc={setIsGalleryVisible}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                marginVertical: 4,
              }}
            >
              <Text style={styles.userNameFont}>
                {ldgUserDetails ? "-" : displayName}
              </Text>
              {!ldgUserDetails && gender === Gender.Male && (
                <Ionicons name="male" size={20} color="#4bb9f3" />
              )}
              {!ldgUserDetails && gender === Gender.Female && (
                <Ionicons name="female" size={20} color="#f268df" />
              )}
            </View>
            <Text style={styles.metaDataFont}>Location: United Kingdom</Text>
          </View>
          <View style={styles.bio}>
            {!ldgUserDetails && (
              <Text style={styles.bioText}>{bio ?? "No bio available"}</Text>
            )}
          </View>
          <View style={styles.userStatsContainer}>
            <View style={styles.statsView}>
              <Text style={styles.statsCount}>
                {ldgUserDetails ? "-" : postsCount}
              </Text>
              <Text style={styles.statsFont}>Posts</Text>
            </View>
            <View style={styles.statsView}>
              <Text style={styles.statsCount}>
                {ldgUserDetails ? "-" : userLikesCount}
              </Text>
              <Text style={styles.statsFont}>Likes</Text>
            </View>

            <Pressable
              style={styles.statsView}
              onPress={() => openFollowerScreen(0)}
            >
              <Text style={styles.statsCount}>
                {ldgUserDetails ? "-" : followings?.length}
              </Text>
              <Text style={styles.statsFont}>Following</Text>
            </Pressable>
            <Pressable
              style={styles.statsView}
              onPress={() => openFollowerScreen(1)}
            >
              <Text style={styles.statsCount}>
                {ldgUserDetails ? "-" : followers?.length}
              </Text>
              <Text style={styles.statsFont}>Followers</Text>
            </Pressable>

            {appUserId !== userId && (
              <View style={styles.interactionContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.followButton]}
                  onPress={
                    isFollowed ? handlePressUnfollowBtn : handlePressFollowBtn
                  }
                >
                  <Text style={styles.buttonText}>
                    {isFollowed ? "Unfollow" : "Follow"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPressIn={openChat} style={styles.button}>
                  <AntDesign
                    name="message1"
                    size={18}
                    color={ThemeColoursPrimary.PrimaryColour}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
        {/* Posts */}
        <View style={styles.userContentContainer}>
          <View style={styles.contentContainerSelectorBar}>
            {buttonStates.map((button: any) => (
              <TouchableOpacity
                key={button.id}
                onPress={() => handlePress(button.id)}
              >
                {button.clicked ? (
                  <View style={styles.textWrapper}>
                    <Text style={styles.menuButtonClicked}>{button.label}</Text>
                    <View style={styles.customUnderline} />
                  </View>
                ) : (
                  <Text style={styles.menuButton}>{button.label}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {ldgContentComplete ? (
            postsData.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: ThemeColoursPrimary.LightGreyBackground,
                }}
              >
                <MasonryFlashList
                  data={postsData}
                  keyExtractor={(post) => post.id}
                  renderItem={renderItem}
                  estimatedItemSize={200} // Estimated size for optimal performance
                  numColumns={2} // Setting 2 columns for masonry layout
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flashListContainer}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <EmptyContent />
            )
          ) : (
            <Loader size={"medium"} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  profileDetails: {
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 8,
  },
  userNameFont: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontWeight: "bold",
    fontSize: 22,
  },
  metaDataFont: {
    fontSize: 10,
    color: ThemeColoursPrimary.SecondaryColour,
    opacity: 0.6,
  },
  bio: {
    marginHorizontal: 8,
    gap: 6,
  },
  bioText: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
  },
  userStatsContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsView: {
    alignItems: "center",
  },
  statsCount: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontWeight: "bold",
    fontSize: 24,
  },
  statsFont: {
    color: ThemeColoursPrimary.SecondaryColour,
  },
  button: {
    padding: 8,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  followButton: {
    width: 90,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
  userContentContainer: {
    height: "100%",
    marginTop: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  contentContainerSelectorBar: {
    height: 34,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
  },
  menuButton: {
    fontSize: 16,
    fontWeight: "normal",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  menuButtonClicked: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  textWrapper: {
    position: "relative",
    alignItems: "center",
  },
  customUnderline: {
    position: "absolute",
    bottom: -4, // Adjust this value to control the gap between the text and underline
    height: 3,
    width: "70%",
    backgroundColor: ThemeColoursPrimary.LogoColour, // Set the underline color
    borderRadius: 18,
  },
  flashListContainer: {
    paddingHorizontal: 2, // Padding on the sides
  },
  cardContainer: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 2, // Horizontal gap between the cards
  },
  backButton: {
    position: "absolute",
    left: -130,
    zIndex: 10, // Ensure it's on top of other elements
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profilePicBackButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});

export default ViewProfile;
