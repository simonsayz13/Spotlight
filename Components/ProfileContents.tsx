import { useEffect, useState } from "react";
import { Pressable, View, Text, Platform, StyleSheet } from "react-native";
import {
  ThemeColoursPrimary,
  userContentSelectorButtons,
} from "../Constants/UI";
import { MasonryFlashList } from "@shopify/flash-list";
import { useDispatch } from "react-redux";
import {
  getPostsByUserId,
  getUserDetails,
} from "../Firebase/firebaseFireStore";
import { appendPosts } from "../Redux/Slices/postsSlices";
import PostCard from "./PostCard";
import EmptyContent from "./EmptyContent";
import Loader from "./Loader";
import { getPostsByUserIdArray } from "../Firebase/FirebasePosts";

type Category = "Posts" | "Favourites" | "Liked";

interface FetchMapItem {
  fetched: boolean;
  fetchFunction: () => Promise<{ id: string }[]>;
  setState: (data: any) => void;
  data: Array<any>;
}

const ProfileContents = (props: any) => {
  const { navigation, userId, userLiked, userFavourites, refreshTrigger } =
    props;
  const [ldgContentComplete, setLdgContentComplete] = useState(false);
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState({ data: [], fetched: false }); // Cache for user's posts
  const [userFavouritesData, setUserFavouritesData] = useState({
    data: [],
    fetched: false,
  });
  const [userLikedData, setUserLikedData] = useState({
    data: [],
    fetched: false,
  });
  const [activeContent, setActiveContent] = useState<Category>("Posts"); // Tracks active tab
  const [buttonStates, setButtonStates] = useState(userContentSelectorButtons);

  const fetchMap: Record<Category, FetchMapItem> = {
    Posts: {
      fetched: userPosts.fetched,
      fetchFunction: () => getPostsByUserId(userId),
      setState: (data: any) => setUserPosts({ data, fetched: true }),
      data: userPosts.data,
    },
    Favourites: {
      fetched: userFavouritesData.fetched,
      fetchFunction: () => getPostsByUserIdArray(userFavourites),
      setState: (data: any) => setUserFavouritesData({ data, fetched: true }),
      data: userFavouritesData.data,
    },
    Liked: {
      fetched: userLikedData.fetched,
      fetchFunction: () => getPostsByUserIdArray(userLiked),
      setState: (data: any) => setUserLikedData({ data, fetched: true }),
      data: userLikedData.data,
    },
  };

  const fetchPosts = async (activeContent: Category, refresh?: boolean) => {
    try {
      const { fetched, fetchFunction, setState } = fetchMap[activeContent];
      if (refresh || !fetched) {
        const fetchedPosts = await fetchFunction();
        const postsWithUserDetails = await Promise.all(
          fetchedPosts.map(async (post: any) => {
            const userDetails: any = await getUserDetails(post.user_id); // Assuming user_id is available in post
            return {
              ...post,
              userDisplayName: userDetails.display_name,
              userProfilePic: userDetails.profile_picture_url,
            };
          })
        );
        setState(postsWithUserDetails);
        dispatch(appendPosts(postsWithUserDetails));
      }
    } catch (error) {
      console.log(`Error fetching contents:`, error);
    } finally {
      setLdgContentComplete(true);
    }
  };

  useEffect(() => {
    fetchPosts("Posts");
  }, []);

  useEffect(() => {
    if (fetchMap[activeContent].fetched) fetchPosts(activeContent, true);
  }, [refreshTrigger]);

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
    const selectedButton = userContentSelectorButtons.find(
      (btn) => btn.id === id
    );
    if (selectedButton) {
      setActiveContent(selectedButton.label as Category);
      setLdgContentComplete(false); // Show loader while fetching
      fetchPosts(selectedButton.label as Category);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postId={item.id} navigation={navigation} />
    </View>
  );

  return (
    <View style={styles.userContentContainer}>
      <View style={styles.contentContainerSelectorBar}>
        {buttonStates.map((button: any) => (
          <Pressable key={button.id} onPress={() => handlePress(button.id)}>
            {button.clicked ? (
              <View style={styles.textWrapper}>
                <Text style={styles.menuButtonClicked}>{button.label}</Text>
                <View style={styles.customUnderline} />
              </View>
            ) : (
              <Text style={styles.menuButton}>{button.label}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {ldgContentComplete ? (
        fetchMap[activeContent].data.length > 0 ? (
          <View
            style={{
              flex: 1,
              backgroundColor: ThemeColoursPrimary.LightGreyBackground,
            }}
          >
            <MasonryFlashList
              data={fetchMap[activeContent].data}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    paddingTop: Platform.OS === "android" ? 8 : 0,
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
    height: "100%",
    marginTop: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
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
    margin: 2,
  },
});

export default ProfileContents;
