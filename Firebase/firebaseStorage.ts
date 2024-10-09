import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "./FirebaseApp";
import { FireStorageFolder } from "../Constants/dbReference";
import { convertPhUriToFileUri } from "../Util/utility";
import { Platform } from "react-native";
// Create a root reference
const storage = getStorage(app);

export const uploadImages = async (uriArray: Array<string>) => {
  const downloadUrls: Array<string> = []; // Array to hold successful download URLs
  for (const uri of uriArray) {
    const convertedUri =
      Platform.OS === "ios" && uri.slice(0, 4) !== "file"
        ? await convertPhUriToFileUri(uri)
        : uri;

    if (!convertedUri) {
      continue;
    }

    const fileName = convertedUri.substring(convertedUri.lastIndexOf("/") + 1);

    try {
      const response = await fetch(convertedUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `posts/${fileName}`);
      try {
        const snapshot = await uploadBytesResumable(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        downloadUrls.push(downloadUrl); // Add successful download URL to the array
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }

  return downloadUrls;
};

export const uploadProfilePicture = async (userId: string, uri: string) => {
  const fileExtension = uri.split(".").pop();
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(
    storage,
    `${FireStorageFolder.UserProfile}/${userId}.${fileExtension}`
  );

  try {
    const snapshot = await uploadBytesResumable(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.log(error);
  }
};
