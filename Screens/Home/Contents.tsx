import { StyleSheet, RefreshControl, ScrollView, Alert } from "react-native";
import PostCard from "../../Components/PostCard";
import { useCallback, useEffect, useState } from "react";
import { getAllPosts } from "../../Firebase/firebaseFireStore";
import { HomeStackScreens } from "../../Constants/UI";
import { setPosts } from "../../Redux/Slices/postsSlices";
import { useSelector } from "react-redux";
import store, { RootState } from "../../Redux/store";

const Contents = (props: any) => {
  const { content, navigation, showSearchBar, searchText } = props;
  const [refreshing, setRefreshing] = useState(false);
  const { posts } = useSelector((state: RootState) => state.posts);
  const [filteredPosts, setFilteredPosts] = useState([]);
  // Refresh the contents page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchPosts();
      setRefreshing(false);
    }, 800); // Simulating a 2-second fetch time
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      store.dispatch(setPosts(data));
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

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
    if (posts) setFilteredPosts(posts);
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
    const filtered = posts.filter((post) =>
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
