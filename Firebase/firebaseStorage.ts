import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "./FirebaseApp";
import { FireStorageFolder } from "../Constants/dbReference";
import { convertPhUriToFileUri } from "../Util/utility";
import { Platform } from "react-native";
// Create a root reference
const storage = getStorage(app);

export const uploadImages = async (uriArray: Array<string>) => {
  const uploadPromises = uriArray.map(async (uri) => {
    const convertedUri =
      Platform.OS === "ios" ? await convertPhUriToFileUri(uri) : uri;
    const fileName = convertedUri!.substring(
      convertedUri!.lastIndexOf("/") + 1
    );
    const response = await fetch(convertedUri!);

    const blob = await response.blob();
    const storageRef = ref(storage, `posts/${fileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded to Firebase:", downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log("Error uploading image:", error);
      return null; // Return null for failed uploads
    }
  });

  const downloadUrls = await Promise.all(uploadPromises);
  return downloadUrls.filter((url) => url !== null); // Filter out any failed uploads
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
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.log(error);
  }
};
