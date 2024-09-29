import * as FileSystem from "expo-file-system";

export const getFileUri = async (uri: string) => {
  const fileName = uri.split("/").pop(); // Get the original file name
  const fileUri = FileSystem.cacheDirectory + fileName!; // Cache directory path

  // Check if the file already exists
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    await FileSystem.copyAsync({
      from: uri,
      to: fileUri,
    });
  }

  return fileUri; // Return the file URI that can be used in <Image>
};

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
    // If within 60 minutes, show "X mins ago"
    return `${diffInMinutes} mins ago`;
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
