import { Share } from "react-native";
import * as Clipboard from "expo-clipboard";
import { getUserProfileDetails } from "../Firebase/FirebaseUsers";

export const sharePost = async (postData: any) => {
  try {
    const result = await Share.share({
      message: `Check out this awesome post I found on Spotlight 🌍✨ https://spotlight.com/share/${postData.id} `,
    });
    if (result.action === Share.sharedAction) {
      // Handle successful sharing here if needed
    }
  } catch (error: any) {
    console.error(error.message);
  }
};

export const copyShareLink = async (postData: any) => {
  const shareLink = `Check out this awesome post I found on Spotlight 🌍✨ https://spotlight.com/share/${postData.id} `;
  await Clipboard.setStringAsync(shareLink);
};

export const fetchUserDetailOnPosts = async (
  fetchedPosts: any,
  otherUsers: any,
  dispatch: any
) => {
  return await Promise.all(
    fetchedPosts.map(async (post: any) => {
      try {
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
      } catch (error) {
        console.error(
          `Error fetching user details for post ${post.id}:`,
          error
        );
        // Return the post as-is if user details couldn't be fetched
        return {
          ...post,
          userDisplayName: "Unknown User",
          userProfilePic: null,
        };
      }
    })
  );
};
