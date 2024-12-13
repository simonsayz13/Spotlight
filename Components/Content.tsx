import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getPostsByUserIds } from "../Firebase/firebaseFireStore";
import { fetchUserDetailOnPosts } from "../Util/Services";
import PostCard from "./PostCard";
import FadeInWrapper from "./FadeInWrapper";
import { MasonryFlashList } from "@shopify/flash-list";
import { ThemeColoursPrimary } from "../Constants/UI";
import Loader from "./Loader";
import { appendPosts } from "../Redux/Slices/postsSlices";
import { useFocusEffect } from "@react-navigation/native";
import EmptyContent from "./EmptyContent";
import { getPaginatedPosts } from "../Firebase/FirebasePosts";

const Content = (props: any) => {
  const { navigation, onScroll, content, setIsDropDownMenuVisible } = props;
  const [refreshing, setRefreshing] = useState(false);
  const otherUsers = useSelector((state: RootState) => state.otherUsers);
  const userFollowings = useSelector(
    (state: RootState) => state.user.userFollowings
  );
  const dispatch = useDispatch();
  const [displayPosts, setDisplayPosts] = useState<Array<any>>([]);
  const [ldgContentComplete, setLdgContentComplete] = useState<boolean>(false);
  const [bottomLoader, setBottomLoader] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isFetched, setIsFetched] = useState(false);

  const fetchInitialPosts = async () => {
    try {
      setLdgContentComplete(false);
      const fetchedPosts: any =
        content === "following"
          ? await getPostsByUserIds(userFollowings)
          : await getPaginatedPosts();
      const postsWithUserDetails = await fetchUserDetailOnPosts(
        fetchedPosts.posts,
        otherUsers,
        dispatch
      );
      dispatch(appendPosts(postsWithUserDetails));
      setDisplayPosts(postsWithUserDetails);
      setLastVisible(fetchedPosts.lastVisible);
    } catch (error) {
      console.log("initial: could not fetch any posts");
    } finally {
      setLdgContentComplete(true);
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    try {
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
      dispatch(appendPosts(postsWithUserDetails));
    } catch (error) {
      console.log("loadmore: could not fetch any posts");
    } finally {
      setLdgContentComplete(true);
      setBottomLoader(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isFetched && content === "discover") {
        fetchInitialPosts();
        setIsFetched(true);
      }
    }, [isFetched, fetchInitialPosts])
  );

  useEffect(() => {
    if (content === "following") {
      if (userFollowings.length > 0) {
        fetchInitialPosts();
      } else {
        setLdgContentComplete(true);
      }
    }
  }, [userFollowings]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsDropDownMenuVisible(true);
    setTimeout(() => {
      if (userFollowings.length === 0) {
        setRefreshing(false);
        setDisplayPosts([]);
      } else {
        fetchInitialPosts();
      }
    }, 1000);
  }, [userFollowings]);

  const onReachedEnd = () => {
    if (lastVisible) {
      setBottomLoader(true);
      loadMorePosts();
    } else {
      setBottomLoader(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={styles.cardContainer}>
        <PostCard postId={item.id} navigation={navigation} />
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

  return ldgContentComplete ? (
    displayPosts.length > 0 ? (
      <FadeInWrapper delay={1500}>
        <MasonryFlashList
          data={displayPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          estimatedItemSize={255}
          disableAutoLayout
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flashListContainer}
          onScroll={onScroll}
          ListFooterComponent={renderBottomLoader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ThemeColoursPrimary.LogoColour]} // Optional: Refresh spinner color
            />
          }
          onEndReachedThreshold={0.02}
          onEndReached={onReachedEnd}
          scrollEventThrottle={16}
        />
      </FadeInWrapper>
    ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[ThemeColoursPrimary.LogoColour]} // Optional: Refresh spinner color
          />
        }
      >
        <EmptyContent />
      </ScrollView>
    )
  ) : (
    <View style={{ flex: 1 }}>
      <Loader size={"medium"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flashListContainer: {
    paddingTop: 2,
    paddingHorizontal: 2, // Padding on the sides
  },
  cardContainer: {
    // flex: 1,
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
