import { Image } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { format, isToday, isSameMinute } from "date-fns";
import { getLocation } from "./LocationService";

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
  return returnedAssetInfo?.localUri;
};

export const clusterMessages = (messages: any) => {
  const clusteredMessages: Array<any> = [];
  let lastTimeStamp: any = null;

  messages.forEach((message: any) => {
    const currentTimeStamp: any = new Date(message.timestamp);

    // For messages within the last 24 hours
    if (isToday(currentTimeStamp)) {
      // Display time if the current message is greater than the last by one minute
      if (!lastTimeStamp || currentTimeStamp - lastTimeStamp >= 60 * 1000) {
        clusteredMessages.push({
          type: "time",
          text: format(currentTimeStamp, "HH:mm"), // Format the time
        });
      }
    } else if (
      !lastTimeStamp ||
      !isSameMinute(lastTimeStamp, currentTimeStamp)
    ) {
      clusteredMessages.push({
        type: "header",
        text: format(currentTimeStamp, "MMMM d, HH:mm"), // Format the date
      });
    }
    // Add the message itself
    clusteredMessages.push(message);
    lastTimeStamp = currentTimeStamp; // Update the last timestamp
  });

  return clusteredMessages;
};

export const getInitials = (name: string) => {
  if (!name) return "";
  const namesArray = name.trim().split(" ");
  const initials = namesArray.map((n) => n.charAt(0)).join("");
  return initials.slice(0, 2).toUpperCase(); // Limit to 2 characters
};

export const getOtherParticipants = (conversations: any, userId: any) => {
  return conversations.map((conversation: any) => {
    const otherParticipants = conversation.participants.filter(
      (participantId: string) => participantId !== userId
    );
    return {
      conversationId: conversation.id,
      otherParticipantId: otherParticipants[0], // Assuming it's a one-on-one conversation
    };
  });
};

export const createTimeStamp = () => {
  return new Date().toString();
};

export const getBoundingBox = async (raidus: number) => {
  const coordinates = await getLocation();
  const earthRadius = 6371;
  const lat = coordinates.latitude;
  const lon = coordinates.longitude;
  const radius = raidus; // in km

  const latDelta = radius / earthRadius;
  const lonDelta = radius / (earthRadius * Math.cos((Math.PI * lat) / 180));

  const minLat = lat - latDelta;
  const maxLat = lat + latDelta;
  const minLon = lon - lonDelta;
  const maxLon = lon + lonDelta;

  return {
    minLat,
    maxLat,
    minLon,
    maxLon,
  };
};

export const sortPostsByDate = (posts: any) => {
  return posts.sort(
    (a: any, b: any) => new Date(b.timeStamp) - new Date(a.timeStamp)
  );
};
