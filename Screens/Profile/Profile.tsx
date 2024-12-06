import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  FollowStackScreens,
  Gender,
  ImageType,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserDetails } from "../../Firebase/firebaseFireStore";
import ProfilePicture from "../../Components/ProfilePicture";
import ImageModal from "../../Components/ImageModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import ProfileContents from "../../Components/ProfileContents";
const Profile = ({ navigation }: any) => {
  const {
    userId,
    userBio,
    userFollowings: followings,
    userLiked,
    userFavourites,
  } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
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
  const heightAnim = useSharedValue(200);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
    fetchUser();
  }, []);

  const handleEdit = () => {
    navigation.navigate(ProfileStackScreens.EditProfile);
  };

  const openFollowerScreen = (tabIndex: number) => {
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
    setRefreshTrigger((prev) => !prev);
    fetchUser();
  };

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
            <Text style={styles.metaDataFont}>IP Address: United Kingdom</Text>
          </View>
          <View style={styles.bio}>
            {!ldgUserDetails && (
              <Text style={styles.bioText} numberOfLines={2}>
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
        <ProfileContents
          navigation={navigation}
          userId={userId}
          userLiked={userLiked}
          userFavourites={userFavourites}
          refreshTrigger={refreshTrigger}
        />
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
    height: 34,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
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
