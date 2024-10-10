// import { StyleSheet, RefreshControl, ScrollView, Alert } from "react-native";
// import PostCard from "../../Components/PostCard";
// import { useCallback, useEffect, useState } from "react";
// import { getAllPosts } from "../../Firebase/firebaseFireStore";
// import { HomeStackScreens } from "../../Constants/UI";
// import { setPosts } from "../../Redux/Slices/postsSlices";
// import { useSelector } from "react-redux";
// import store, { RootState } from "../../Redux/store";

// const Contents = (props: any) => {
//   const { content, navigation, showSearchBar, searchText } = props;
//   const [refreshing, setRefreshing] = useState(false);
//   const { posts } = useSelector((state: RootState) => state.posts);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   // Refresh the contents page
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       fetchPosts();
//       setRefreshing(false);
//     }, 800); // Simulating a 2-second fetch time
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const data = await getAllPosts();
//       store.dispatch(setPosts(data));
//     } catch (error) {
//       Alert.alert("Error", "Error fetching posts");
//     }
//   };

//   const openPost = (postData: any) => {
//     navigation.navigate(HomeStackScreens.Post, {
//       postData: postData,
//     });
//   };

//   //> Hooks
//   //* Hook for loading data
//   useEffect(() => {
//     fetchPosts();
//   }, [content]);

//   useEffect(() => {
//     if (posts) {
//       setFilteredPosts(posts);
//     }
//   }, [posts]);

//   //* Change the display of posts based on if search bar is active
//   useEffect(() => {
//     if (showSearchBar) {
//       setFilteredPosts([]);
//     } else {
//       setFilteredPosts(posts);
//     }
//   }, [showSearchBar]);

//   //* Filter the posts whose tilte contain the search text
//   useEffect(() => {
//     if (searchText === "") {
//       return setFilteredPosts([]);
//     } // Display blank when no search text
//     // Filter posts whose title contains search text
//     const filtered = posts.filter((post) =>
//       //@ts-ignore
//       post?.title?.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredPosts(filtered);
//   }, [searchText]);

//   return (
//     <ScrollView
//       contentContainerStyle={styles.scrollView}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           colors={["#ff0000"]} // Optional: Color of the refresh spinner
//           progressBackgroundColor="#ffffff" // Optional: Background color of the refresh spinner
//         />
//       }
//       showsVerticalScrollIndicator={false}
//     >
//       {filteredPosts.map((post) => {
//         return (
//           <PostCard
//             //@ts-ignore
//             key={post.id}
//             postData={post}
//             openPost={openPost}
//             navigation={navigation}
//             self={false}
//           />
//         );
//       })}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     flexWrap: "wrap", // Ensures items wrap into the next row
//     flexDirection: "row", // Layout items horizontally
//     paddingLeft: "1%",
//     paddingTop: 4,
//     gap: 4, // Space between cards
//     paddingBottom: 8,
//     alignItems: "flex-start", // Ensure items align to the top
//   },
// });

// export default Contents;
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Alert, RefreshControl, View } from "react-native";
import PostCard from "../../Components/PostCard";
import { getAllPosts } from "../../Firebase/firebaseFireStore";
import { HomeStackScreens } from "../../Constants/UI";
import { setPosts } from "../../Redux/Slices/postsSlices";
import { useSelector } from "react-redux";
import store, { RootState } from "../../Redux/store";
import { MasonryFlashList } from "@shopify/flash-list";

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
    }, 800); // Simulating a fetch time
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

  return (
    <MasonryFlashList
      data={filteredPosts}
      keyExtractor={(post) => post.id}
      renderItem={({ item: post }) => (
        <View style={styles.cardContainer}>
          <PostCard
            postData={post}
            openPost={openPost}
            navigation={navigation}
            // self={false}
          />
        </View>
      )}
      estimatedItemSize={20} // Estimated size for optimal performance
      numColumns={2} // Setting 2 columns for masonry layout
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flashListContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#ff0000"]} // Optional: Refresh spinner color
          progressBackgroundColor="#ffffff" // Optional: Background color of refresh spinner
        />
      }
    />
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
