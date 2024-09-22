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
