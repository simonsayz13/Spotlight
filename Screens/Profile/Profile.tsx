import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  Gender,
  HomeStackScreens,
  ProfileStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
  userContentSelectorButtons,
} from "../../Constants/UI";
import { mockUserBio, mockUserPostsData } from "../../Constants/mockData";
import { ScrollView } from "react-native-gesture-handler";
import { logOut } from "../../Firebase/firebaseAuth";
import PostCard from "../../Components/PostCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getPostsByUserId } from "../../Firebase/firebaseFireStore";
import { useFocusEffect } from "@react-navigation/native";

const Profile = ({ navigation }: any) => {
  const [buttonStates, setButtonStates] = useState(userContentSelectorButtons);
  const {
    userId,
    userDisplayName,
    userProfilePhotoURL,
    userAge,
    userBio,
    userGender,
    userLocation,
    userEducation,
  } = useSelector((state: RootState) => state.user);
  const [postsData, setPostsData] = useState<Array<any>>([]);

  useFocusEffect(
    useCallback(() => {
      // Define an async function within the callback
      const fetchPosts = async () => {
        try {
          return await getPostsByUserId(userId!);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts().then((posts) => {
        console.log("fetched:", posts);
        setPostsData(posts!);
      });
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileDetails}>
        <Image
          source={require("../../assets/test_image/mock_profile_picture.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Text style={styles.userNameFont}>{userDisplayName}</Text>
          {userGender === Gender.Male && (
            <Ionicons name="male" size={20} color="#4bb9f3" />
          )}
          {userGender === Gender.Female && (
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
          <TouchableOpacity onPress={handleEdit}>
            <AntDesign
              name="edit"
              size={24}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.descriptionText}>
          {userBio ?? "Add a bio in edit profile"}
        </Text>
      </View>
      <View style={styles.userStatsContainer}>
        <View style={styles.statsView}>
          <Text style={styles.statsCount}>4</Text>
          <Text style={styles.statsFont}>Following</Text>
        </View>
        <View style={styles.statsView}>
          <Text style={styles.statsCount}>5</Text>
          <Text style={styles.statsFont}>Followers</Text>
        </View>
        <View style={styles.statsView}>
          <Text style={styles.statsCount}>666</Text>
          <Text style={styles.statsFont}>Likes & Favs</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
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
                title={post.title}
                user={userDisplayName}
                likes={post.likes}
                imageUrl={post.media[0].media_url}
                openPost={() => {
                  navigation.navigate(HomeStackScreens.Post);
                }}
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
