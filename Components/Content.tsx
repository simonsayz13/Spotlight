import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import {
  getPaginatedPosts,
  getPostsByUserIds,
} from "../Firebase/firebaseFireStore";
import { fetchUserDetailOnPosts } from "../Util/Services";
import PostCard from "./PostCard";
import FadeInWrapper from "./FadeInWrapper";
import { MasonryFlashList } from "@shopify/flash-list";
import { ThemeColoursPrimary } from "../Constants/UI";
import Loader from "./Loader";

const Content = (props: any) => {
  const { navigation, onScroll, content } = props;
  const [refreshing, setRefreshing] = useState(false);
  const otherUsers = useSelector((state: RootState) => state.otherUsers);
  const { userFollowings } = useSelector((state: RootState) => state.user);
  const [displayPosts, setDisplayPosts] = useState<Array<any>>([]);
  const [displayList, setDisplayList] = useState<boolean>(false);
  const [bottomLoader, setBottomLoader] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const dispatch = useDispatch();

  const fetchInitialPosts = async () => {
    try {
      const fetchedPosts: any =
        content === "following"
          ? await getPostsByUserIds(userFollowings)
          : await getPaginatedPosts();
      const postsWithUserDetails = await fetchUserDetailOnPosts(
        fetchedPosts.posts,
        otherUsers,
        dispatch
      );
      setDisplayPosts(postsWithUserDetails);
      setLastVisible(fetchedPosts.lastVisible);
      setDisplayList(true);
    } catch (error) {
      Alert.alert("Oops", "Could not fetch any posts");
    } finally {
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    const fetchedPosts: any =
      content === "following"
        ? await getPostsByUserIds(userFollowings, lastVisible)
        : await getPaginatedPosts(lastVisible);
    fetchedPosts.posts.length < 10
      ? setLastVisible(null)
      : setLastVisible(fetchedPosts.lastVisible);
    const postsWithUserDetails = await fetchUserDetailOnPosts(
      fetchedPosts.posts,
      otherUsers,
      dispatch
    );
    setDisplayPosts((prevPosts) => [...prevPosts, ...postsWithUserDetails]);
    setBottomLoader(false);
  };

  // Hook for loading data
  useEffect(() => {
    fetchInitialPosts();
  }, []);

  // Refresh the contents page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchInitialPosts();
    }, 1000);
  }, []);

  const onReachedEnd = () => {
    console.log(lastVisible);
    if (lastVisible) {
      setBottomLoader(true);
      loadMorePosts();
    } else {
      console.log("setFalse");
      setBottomLoader(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={styles.cardContainer} key={item.id}>
        <PostCard postData={item} navigation={navigation} />
      </View>
    ),
    [navigation]
  );

  const renderBottomLoader = () =>
    bottomLoader && (
      <View style={styles.bottomLoaderContainer}>
        <Loader size={"small"} />
      </View>
    );

  return displayList ? (
    <FadeInWrapper delay={1500}>
      <MasonryFlashList
        data={displayPosts}
        keyExtractor={(item) => item.id}
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
        onEndReachedThreshold={0.000001}
        onEndReached={onReachedEnd}
      />
    </FadeInWrapper>
  ) : (
    <Loader size={"medium"} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

export default Content;
