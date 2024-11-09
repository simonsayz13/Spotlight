import { Share } from "react-native";
import * as Clipboard from "expo-clipboard";

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
