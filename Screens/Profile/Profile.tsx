import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Pressable,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  FollowStackScreens,
  Gender,
  HomeStackScreens,
  ImageType,
  ProfileStackScreens,
  ThemeColoursPrimary,
  userContentSelectorButtons,
} from "../../Constants/UI";
import PostCard from "../../Components/PostCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserDetails,
  getPostsByUserId,
} from "../../Firebase/firebaseFireStore";
import { MasonryFlashList } from "@shopify/flash-list";
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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ScrollView } from "react-native-gesture-handler";
const Profile = ({ navigation }: any) => {
  const {
    userId,
    userBio,
    userFollowings: followings,
  } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  const [buttonStates, setButtonStates] = useState(userContentSelectorButtons);
  const [postsData, setPostsData] = useState<Array<any>>([]);
  const [displayName, setDisplayName] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [bio, setBio] = useState(userBio);
  const [gender, setGender] = useState("");
  const [followers, setFollowers] = useState([]);
  const [ldgUserDetails, setLdgUserDetails] = useState(false);
  const [ldgSuccUserDetails, setLdgSuccUserDetails] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [userLikesCount, setUserLikesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const dispatch = useDispatch();
  const heightAnim = useSharedValue(200);
  const [refreshing, setRefreshing] = useState(false);
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
      const fetchedPosts = await getPostsByUserId(userId!);
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
    }
  };

  const fetchUser = async () => {
    setLdgUserDetails(true);
    setLdgSuccUserDetails(false);
    try {
      const likesCount = await getTotalLikesForUserPosts(userId!);
      const postsCount = await getTotalNumberOfPosts(userId!);
      const {
        profile_picture_url,
        display_name,
        biography,
        gender,
        followers,
      }: any = await getUserDetails(userId!);
      setPostsCount(postsCount);
      setUserLikesCount(likesCount);
      setDisplayName(display_name);
      setProfilePicUrl(profile_picture_url);
      setBio(biography);
      setGender(gender);
      setFollowers(followers);
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
  }, []);

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

  const handleEdit = () => {
    navigation.navigate(ProfileStackScreens.EditProfile);
  };

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  const openFollowerScreen = (tabIndex) => {
    navigation.navigate("FollowStack", {
      screen: FollowStackScreens.FollowerList,
      params: {
        displayName,
        followers,
        followings,
        profileId: userId,
        appUserId: userId,
        appUserFollowings: followings,
        tabIndex: tabIndex,
        type: "appUser",
      },
    });
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchUser();
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postId={item.id} openPost={openPost} navigation={navigation} />
    </View>
  );
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const threshold = 10; // Adjust threshold as needed
    const isBottomReached =
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - threshold;

    // Update state only if the value has actually changed
    if (isAtBottom !== isBottomReached) {
      setIsAtBottom(isBottomReached);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ImageModal
        imageUri={profilePicUrl}
        isGalleryVisible={isGalleryVisible}
        setIsGalleryVisible={setIsGalleryVisible}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[ThemeColoursPrimary.LogoColour]} // Optional: Refresh spinner color
          />
        }
        onScroll={handleScroll}
        bounces={!isAtBottom} // Disable bounce when at the bottom
        scrollEventThrottle={16}
      >
        <Animated.View style={(styles.profileContainer, animatedStyleHeight)}>
          <View style={styles.profileDetails}>
            <View style={styles.profileAndActionContainer}>
              <ProfilePicture
                uri={profilePicUrl}
                userDisplayName={displayName}
                type={ImageType.Profile}
                onPressFunc={setIsGalleryVisible}
              />
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={handleEdit}>
                  <FontAwesome5
                    name="user-edit"
                    size={24}
                    color={ThemeColoursPrimary.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                marginBottom: 2,
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
            <Text style={styles.metaDataFont}>IP Address: United Kingdom</Text>
          </View>
          <View style={styles.description}>
            {!ldgUserDetails && (
              <Text style={styles.descriptionText} numberOfLines={2}>
                {bio ?? "Add a bio in edit profile"}
              </Text>
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
              <View style={styles.statsView}>
                <Text style={styles.statsCount}>
                  {ldgUserDetails ? "-" : followers?.length}
                </Text>
                <Text style={styles.statsFont}>Followers</Text>
              </View>
            </Pressable>
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
  profileContainer: {},
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
  description: {
    marginHorizontal: 8,
    gap: 6,
  },
  descriptionTitle: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionText: {
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
    height: 34,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
  userContentContainer: {
    flex: 1,
    marginTop: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 5, // For Android shadow
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
  },
  contentContainerSelectorBar: {
    height: 34,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
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
    marginHorizontal: 2, // Horizontal gap between the cards
    marginVertical: 4,
  },
  profileAndActionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  actionContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default Profile;
