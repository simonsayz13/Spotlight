import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useNavigation } from "@react-navigation/native";
import {
  getPostsByUserId,
  getUserDetails,
} from "../../Firebase/firebaseFireStore";
import { appendPosts } from "../../Redux/Slices/postsSlices";
import { View, StyleSheet } from "react-native";
import PostCard from "../PostCard";
import { MasonryFlashList } from "@shopify/flash-list";
import EmptyContent from "../EmptyContent";
import Loader from "../Loader";
import { ThemeColoursPrimary } from "../../Constants/UI";

const UserPostContents = () => {
  const { userId } = useSelector((state: RootState) => state.user);
  const [ldgContentComplete, setLdgContentComplete] = useState(false);
  const [displayPosts, setDisplayPosts] = useState<Array<any>>([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPostsByUserId(userId!);
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
      setDisplayPosts(postsWithUserDetails);
      dispatch(appendPosts(postsWithUserDetails));
    } catch (error) {
      console.log(`Error fetching contents:`, error);
    } finally {
      setLdgContentComplete(true);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postId={item.id} navigation={navigation} />
    </View>
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      {ldgContentComplete ? (
        displayPosts.length > 0 ? (
          <MasonryFlashList
            data={displayPosts}
            keyExtractor={(post) => post.id}
            renderItem={renderItem}
            estimatedItemSize={200} // Estimated size for optimal performance
            numColumns={2} // Setting 2 columns for masonry layout
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flashListContainer}
            nestedScrollEnabled={true}
            bounces={false}
          />
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
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 2,
    marginVertical: 4,
  },
  flashListContainer: {
    paddingHorizontal: 2, // Padding on the sides
  },
});
export default UserPostContents;
