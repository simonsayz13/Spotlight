import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Alert, RefreshControl, View, Text } from "react-native";
import PostCard from "../../Components/PostCard";
import { getPaginatedPosts } from "../../Firebase/firebaseFireStore";
import { HomeStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import { setPosts } from "../../Redux/Slices/postsSlices";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../Redux/store";
import { MasonryFlashList } from "@shopify/flash-list";
import FadeInWrapper from "../../Components/FadeInWrapper";
import Loader from "../../Components/Loader";
import { getUserProfileDetails } from "../../Firebase/FirebaseUsers";

const Contents = (props: any) => {
  const { content, navigation, showSearchBar, searchText, onScroll } = props;
  const [refreshing, setRefreshing] = useState(false);
  const { posts } = useSelector((state: RootState) => state.posts);
  const otherUsers = useSelector((state: RootState) => state.otherUsers);
  const [filteredPosts, setFilteredPosts] = useState<Array<any>>([]);
  const [displayList, setDisplayList] = useState<boolean>(false);
  const [bottomLoader, setBottomLoader] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const dispatch = useDispatch();

  const fetchInitialPosts = async () => {
    try {
      const fetchedPosts: any = await getPaginatedPosts();
      setLastVisible(fetchedPosts.lastVisible);
      const postsWithUserDetails = await fetchUserDetailOnPosts(
        fetchedPosts.posts
      );
      setFilteredPosts(postsWithUserDetails);
      store.dispatch(setPosts(postsWithUserDetails));
      setDisplayList(true);
      setRefreshing(false);
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

  const fetchUserDetailOnPosts = async (fetchedPosts: any) => {
    return await Promise.all(
      fetchedPosts.map(async (post: any) => {
        let userDetails: any = await getUserProfileDetails(
          post.user_id,
          otherUsers,
          dispatch
        );
        return {
          ...post,
          userDisplayName: userDetails.displayName,
          userProfilePic: userDetails.profilePictureUrl,
        };
      })
    );
  };

  // Refresh the contents page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchInitialPosts();
  }, []);

  const loadMorePosts = async () => {
    const fetchedPosts: any = await getPaginatedPosts(lastVisible);
    fetchedPosts.posts.length < 10
      ? setLastVisible(null)
      : setLastVisible(fetchedPosts.lastVisible);
    const postsWithUserDetails = await fetchUserDetailOnPosts(
      fetchedPosts.posts
    );
    setFilteredPosts((prevPosts) => [...prevPosts, ...postsWithUserDetails]);
    setBottomLoader(false);
  };

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  // Hook for loading data
  useEffect(() => {
    fetchInitialPosts();
  }, [content]);

  // Change the display of posts based on if search bar is active
  useEffect(() => {
    if (showSearchBar) {
      setFilteredPosts([]);
    } else {
      setFilteredPosts(posts);
    }
  }, [showSearchBar]);

  // Filter the posts whose title contain the search text
  useEffect(() => {
    if (searchText === "") {
      return setFilteredPosts([]);
    }
    const filtered = posts.filter((post: any) =>
      post?.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchText]);

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postData={item} openPost={openPost} navigation={navigation} />
    </View>
  );

  const renderBottomLoader = () =>
    bottomLoader && (
      <View style={styles.bottomLoaderContainer}>
        <Loader size="small" color={ThemeColoursPrimary.LogoColour} />
      </View>
    );

  const onReachedEnd = () => {
    if (lastVisible) {
      setBottomLoader(true);
      loadMorePosts();
    }
  };

  return displayList ? (
    <FadeInWrapper delay={1500}>
      <MasonryFlashList
        data={filteredPosts}
        keyExtractor={(post: any) => post.id}
        renderItem={renderItem}
        estimatedItemSize={200} // Estimated size for optimal performance
        numColumns={2} // Setting 2 columns for masonry layout
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flashListContainer}
        onScroll={onScroll}
        ListFooterComponent={renderBottomLoader}
        scrollEventThrottle={30}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[ThemeColoursPrimary.LogoColour]} // Optional: Refresh spinner color
          />
        }
        onEndReachedThreshold={0.2}
        onEndReached={onReachedEnd}
      />
    </FadeInWrapper>
  ) : (
    <Loader size="small" color={ThemeColoursPrimary.LogoColour} />
  );
};

const styles = StyleSheet.create({
  flashListContainer: {
    paddingHorizontal: 2, // Padding on the sides
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 2, // Horizontal gap between the cards
    marginBottom: 4, // Vertical gap between rows
  },
  bottomLoaderContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 60,
  },
});

export default Contents;
