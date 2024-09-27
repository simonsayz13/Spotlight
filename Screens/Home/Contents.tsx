import { StyleSheet, RefreshControl, ScrollView, Alert } from "react-native";
import PostCard from "../../Components/PostCard";
import { useCallback, useEffect, useState } from "react";
import { getAllPosts } from "../../Firebase/firebaseFireStore";
import { HomeStackScreens } from "../../Constants/UI";

const Contents = (props: any) => {
  const { content, navigation } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<Array<any>>([]); // Assuming this will be your data source

  // Refresh the contents page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchPosts();
      setRefreshing(false);
    }, 800); // Simulating a 2-second fetch time
  }, [data]);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setData(data);
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

  // Hook for loading data
  useEffect(() => {
    fetchPosts();
  }, [content]);

  const openPost = (postData: any) => {
    navigation.navigate(HomeStackScreens.Post, {
      postData: postData,
    });
  };

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
      {data.map((post) => {
        return (
          <PostCard
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
