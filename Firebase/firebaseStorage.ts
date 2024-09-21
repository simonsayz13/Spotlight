import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "./FirebaseApp";
// Create a root reference
const storage = getStorage(app);

export const uploadImage = async (uri: string) => {
  const fileName = uri.substring(uri.lastIndexOf("/") + 1);

  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `test/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log("Image uploaded to Firebase:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.log(error);
  }
};
