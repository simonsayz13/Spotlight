import { StyleSheet, RefreshControl, ScrollView, Alert } from "react-native";
import PostCard from "../../Components/PostCard";
import { useCallback, useEffect, useState } from "react";
import { getAllPosts, getUserDetails } from "../../Firebase/firebaseFireStore";
import { HomeStackScreens } from "../../Constants/UI";
import { setPosts } from "../../Redux/Slices/postsSlices";
import { useSelector } from "react-redux";
import store, { RootState } from "../../Redux/store";

const Contents = (props: any) => {
  const { content, navigation, showSearchBar, searchText } = props;
  const [refreshing, setRefreshing] = useState(false);
  const { posts } = useSelector((state: RootState) => state.posts);
  const [filteredPosts, setFilteredPosts] = useState([]);

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
    }, 800); // Simulating a 2-second fetch time
  }, []);

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

  //> Hooks
  //* Hook for loading data
  useEffect(() => {
    fetchPosts();
  }, [content]);

  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts);
    }
  }, [posts]);

  //* Change the display of posts based on if search bar is active
  useEffect(() => {
    if (showSearchBar) {
      setFilteredPosts([]);
    } else {
      setFilteredPosts(posts);
    }
  }, [showSearchBar]);

  //* Filter the posts whose tilte contain the search text
  useEffect(() => {
    if (searchText === "") {
      return setFilteredPosts([]);
    } // Display blank when no search text
    // Filter posts whose title contains search text
    const filtered = posts.filter((post) =>
      //@ts-ignore
      post?.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchText]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#ff0000"]} // Optional: Color of the refresh spinner
          progressBackgroundColor="#ffffff" // Optional: Background color of the refresh spinner
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {filteredPosts.map((post) => {
        return (
          <PostCard
            //@ts-ignore
            key={post.id}
            postData={post}
            openPost={openPost}
            navigation={navigation}
            self={false}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 4,
    gap: 4,
    paddingBottom: 8,
  },
  textFont: {
    fontSize: 40,
  },
});

export default Contents;
