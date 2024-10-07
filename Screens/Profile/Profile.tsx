import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  Gender,
  HomeStackScreens,
  MessagingStackScreens,
  ProfileStackScreens,
  ThemeColoursPrimary,
  userContentSelectorButtons,
} from "../../Constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import { logOut } from "../../Firebase/firebaseAuth";
import PostCard from "../../Components/PostCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserDetails,
  getPostsByUserId,
} from "../../Firebase/firebaseFireStore";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Profile = ({ navigation, route }: any) => {
  const [buttonStates, setButtonStates] = useState(userContentSelectorButtons);
  const guestView = route?.params?.guestView;
  const opId = route?.params?.opId;
  const {
    userId,
    userDisplayName,
    userProfilePhotoURL,
    userAge,
    userBio,
    userGender,
    userLocation,
    userFollowers,
    userFollowings,
  } = useSelector((state: RootState) => {
    return state.user;
  });
  const [postsData, setPostsData] = useState<Array<any>>([]);
  const [displayName, setDisplayName] = useState(userDisplayName);
  const [profilePicUrl, setProfilePicUrl] = useState(userProfilePhotoURL);
  const [bio, setBio] = useState(userBio);
  const [gender, setGender] = useState(userGender);
  const [followers, setFollowers] = useState(userFollowers);
  const [followings, setfollowings] = useState(userFollowings);

  useFocusEffect(
    useCallback(() => {
      // Define an async function within the callback
      const fetchPosts = async (userId: string) => {
        try {
          return await getPostsByUserId(userId);
        } catch (error) {
          Alert.alert("Error", `${error}`);
        }
      };

      const id = guestView ? opId : userId;
      fetchPosts(id).then((posts) => {
        setPostsData(posts!);
      });

      if (guestView) {
        const fetchUser = async () => {
          try {
            return await getUserDetails(opId);
          } catch (error) {
            Alert.alert("Error", `${error}`);
          }
        };
        fetchUser().then((data: any) => {
          const {
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
        });
      }
    }, [userId]) // Include dependencies like userId if they change
  );

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
    // const clickedScreen = buttonStates.find((item) => id == item.id)?.label;
  };

  const handleLogout = () => {
    logOut();
    navigation.replace(ProfileStackScreens.LoginSignUp);
  };

  const handleEdit = () => {
    navigation.navigate(ProfileStackScreens.EditProfile);
  };

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  const openChat = () => {
    navigation.navigate(MessagingStackScreens.Chat, {
      userId: opId,
      userName: displayName,
      profilePicUrl,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileDetails}>
        {profilePicUrl ? (
          <Image source={{ uri: profilePicUrl }} style={styles.image} />
        ) : (
          <FontAwesome6 name="circle-user" size={70} color="black" />
        )}
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Text style={styles.userNameFont}>{displayName}</Text>
          {gender === Gender.Male && (
            <Ionicons name="male" size={20} color="#4bb9f3" />
          )}
          {gender === Gender.Female && (
            <Ionicons name="female" size={20} color="#f268df" />
          )}
        </View>
        <Text style={styles.metaDataFont}>IP Address: United Kingdom</Text>
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
          {guestView ? (
            <TouchableOpacity onPressIn={openChat}>
              <FontAwesome6
                name="envelope"
                size={24}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEdit}>
              <AntDesign
                name="edit"
                size={24}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.descriptionText}>
          {guestView
            ? bio ?? "No bio available"
            : userBio ?? "Add a bio in edit profile"}
        </Text>
      </View>
      <View style={styles.userStatsContainer}>
        <View style={styles.statsView}>
          <Text style={styles.statsCount}>{followings?.length}</Text>
          <Text style={styles.statsFont}>Following</Text>
        </View>
        <View style={styles.statsView}>
          <Text style={styles.statsCount}>{followers?.length}</Text>
          <Text style={styles.statsFont}>Followers</Text>
        </View>
        <View style={styles.statsView}>
          <Text style={styles.statsCount}>666</Text>
          <Text style={styles.statsFont}>Likes & Favs</Text>
        </View>
        {guestView ? (
          <TouchableOpacity style={styles.signOutButton}>
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        )}
      </View>
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

        <ScrollView contentContainerStyle={styles.scrollView}>
          {postsData.map((post) => {
            return (
              <PostCard
                key={post.id}
                postData={post}
                openPost={openPost}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
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
  signOutButton: {
    padding: 8,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
  userContentContainer: {
    flex: 1,
    marginTop: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 5, // For Android shadow
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  contentContainerSelectorBar: {
    height: 34,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  scrollView: {
    flexGrow: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 10,
    gap: 4,
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
  image: {
    width: 100, // Width and height should be the same
    height: 100,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
});

export default Profile;
