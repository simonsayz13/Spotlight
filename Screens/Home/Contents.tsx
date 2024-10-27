import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Alert, RefreshControl, View, Text } from "react-native";
import PostCard from "../../Components/PostCard";
import { getAllPosts, getUserDetails } from "../../Firebase/firebaseFireStore";
import { HomeStackScreens } from "../../Constants/UI";
import { setPosts } from "../../Redux/Slices/postsSlices";
import { useSelector } from "react-redux";
import store, { RootState } from "../../Redux/store";
import { MasonryFlashList } from "@shopify/flash-list";
import FadeInWrapper from "../../Components/FadeInWrapper";

const Contents = (props: any) => {
  const { content, navigation, showSearchBar, searchText, onScroll } = props;
  const [refreshing, setRefreshing] = useState(false);
  const { posts } = useSelector((state: RootState) => state.posts);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [displayList, setDisplayList] = useState(false);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getAllPosts();
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
      store.dispatch(setPosts(postsWithUserDetails));
      setTimeout(() => {
        setDisplayList(true);
      }, 100);
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

  // Refresh the contents page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchPosts();
      setRefreshing(false);
    }, 800); // Simulating a fetch time
  }, []);

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  // Hook for loading data
  useEffect(() => {
    fetchPosts();
  }, [content]);

  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts);
    }
  }, [posts]);

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
    const filtered = posts.filter((post) =>
      post?.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchText]);

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postData={item} openPost={openPost} navigation={navigation} />
    </View>
  );

  return (
    displayList && (
      <FadeInWrapper delay={1000}>
        <MasonryFlashList
          data={filteredPosts}
          keyExtractor={(post) => post.id}
          renderItem={renderItem}
          estimatedItemSize={1} // Estimated size for optimal performance
          numColumns={2} // Setting 2 columns for masonry layout
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flashListContainer}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff0000"]} // Optional: Refresh spinner color
              progressBackgroundColor="#ffffff" // Optional: Background color of refresh spinner
            />
          }
        />
      </FadeInWrapper>
    )
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
});

export default Contents;
