import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
  Animated,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
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
const ViewProfile = ({ navigation, route }: any) => {
  const { userId: appUserId, userFollowings: appUserFollowings } = useSelector(
    (state: RootState) => {
      return state.user;
    }
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
  const [followings, setfollowings] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [ldgUserDetails, setLdgUserDetails] = useState(false);
  const [ldgSuccUserDetails, setLdgSuccUserDetails] = useState(false);

  let heightAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    if (ldgSuccUserDetails) {
      Animated.timing(heightAnim, {
        toValue: 250,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [ldgSuccUserDetails]);

  useEffect(() => {
    if (ldgUserDetails) {
      Animated.timing(heightAnim, {
        toValue: 216,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [ldgUserDetails]);

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
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

  const fetchUser = async () => {
    setLdgUserDetails(true);
    setLdgSuccUserDetails(false);
    try {
      return await getUserDetails(userId);
    } catch (error) {
      setLdgUserDetails(false);
      Alert.alert("Error", `${error}`);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser().then((data: any) => {
      const {
        user_id,
        profile_picture_url,
        display_name,
        biography,
        gender,
        followers,
        followings,
      } = data;
      setDisplayName(display_name);
      setProfilePicUrl(profile_picture_url);
      setBio(biography);
      setGender(gender);
      setFollowers(followers);
      setfollowings(followings);
      setProfileUserId(user_id);
      setLdgUserDetails(false);
      setLdgSuccUserDetails(true);
      followers?.find((followerId) => followerId === appUserId) &&
        setIsFollowed(true);
    });
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

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postData={item} openPost={openPost} navigation={navigation} />
    </View>
  );

  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ImageModal
        imageUri={profilePicUrl}
        isGalleryVisible={isGalleryVisible}
        setIsGalleryVisible={setIsGalleryVisible}
      />

      <Animated.View style={(styles.profileContainer, { height: heightAnim })}>
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
          <Text style={styles.metaDataFont}>Location: United Kingdom</Text>
        </View>
        <View style={styles.description}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.descriptionTitle}>Bio</Text>
          </View>
          {!ldgUserDetails && (
            <Text style={styles.descriptionText}>
              {bio ?? "No bio available"}
            </Text>
          )}
        </View>
        <View style={styles.userStatsContainer}>
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
          <View style={styles.statsView}>
            <Text style={styles.statsCount}>666</Text>
            <Text style={styles.statsFont}>Likes & Favs</Text>
          </View>
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
          estimatedItemSize={10} // Estimated size for optimal performance
          numColumns={2} // Setting 2 columns for masonry layout
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flashListContainer}
        />
      </View>
    </SafeAreaView>
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
    marginBottom: 12,
  },
  descriptionTitle: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionText: {
    color: ThemeColoursPrimary.SecondaryColour,
  },
  userStatsContainer: {
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
    flex: 1,
    marginTop: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 5, // For Android shadow
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
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
