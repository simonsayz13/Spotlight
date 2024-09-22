import { StyleSheet, RefreshControl, ScrollView } from "react-native";
import PostCard from "../../Components/PostCard";
import { useCallback, useEffect, useState } from "react";
import { mockExploreData } from "../../Constants/mockData";
import { ThemeColours, ThemeColoursPrimary } from "../../Constants/UI";

const Contents = (props: any) => {
  const { content, openPost } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]); // Assuming this will be your data source

  // Refresh the contents page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate a network request or data fetching
    setTimeout(() => {
      // Update  data here
      console.log("refreshing...");
      setRefreshing(false);
    }, 2000); // Simulating a 2-second fetch time
  }, [data]);

  // Hook for loading data
  useEffect(() => {
    console.log(content);
  }, [content]);

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
      {mockExploreData.map((data) => {
        return (
          <PostCard
            key={data.id}
            title={data.title}
            user={data.user}
            likes={data.likes}
            openPost={openPost}
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
