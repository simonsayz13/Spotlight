import { Image } from "react-native";
import * as MediaLibrary from "expo-media-library";

export const formatRelativeTime = (timeStamp: string) => {
  const givenDate = new Date(timeStamp);
  const currentDate = new Date();
  const diffInMilliseconds = currentDate.getTime() - givenDate.getTime();

  // Convert milliseconds to other units
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    if (diffInMinutes < 1) {
      return `now`;
    } else {
      return `${diffInMinutes} mins ago`;
    }
  } else if (diffInHours < 24) {
    // If within 24 hours, show "X hours ago"
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    // If within 7 days, show "X days ago"
    return `${diffInDays} days ago`;
  } else {
    // If more than a week, show the full date (e.g., "Sep 20, 2024")
    return givenDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export const sortConversationsByLastMessage = (conversations: any) => {
  return conversations.sort((a: any, b: any) => {
    const aTimestamp = a.lastMessage?.timestamp || 0; // Use 0 if timestamp is not present
    const bTimestamp = b.lastMessage?.timestamp || 0; // Use 0 if timestamp is not present

    // Compare timestamps to sort in descending order
    return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime(); // For descending order
  });
};

export const delay = (ms: number = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getImageDimensions = (
  uri: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width: number, height: number) => resolve({ width, height }),
      reject
    );
  });
};

export const createMediaData = async (
  uploadedImageURLs: Array<string>
): Promise<Array<Media>> => {
  const mediaWithDimensions: Array<Media> = await Promise.all(
    uploadedImageURLs.map(async (url) => {
      const { width, height } = await getImageDimensions(url);
      return {
        type: "image",
        media_url: url,
        width,
        height,
      };
    })
  );
  return mediaWithDimensions;
};

export const convertPhUriToFileUri = async (phUri: string) => {
  const assetId = phUri.slice(5);
  let returnedAssetInfo = await MediaLibrary.getAssetInfoAsync(assetId);
  return returnedAssetInfo.localUri;
};
