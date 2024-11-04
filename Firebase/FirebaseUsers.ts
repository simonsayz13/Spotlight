import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "./FirebaseApp";
import { FireStoreCollections } from "../Constants/dbReference";

const db = firestoreDB;

export const getUserProfileDetails = async (userId: string) => {
  const userRef = doc(db, FireStoreCollections.Users, userId); // Reference to the user document

  try {
    const userSnapshot = await getDoc(userRef); // Retrieve the document snapshot

    if (userSnapshot.exists()) {
      const { display_name, profile_picture_url } = userSnapshot.data(); // Destructure the fields
      return {
        displayName: display_name,
        profilePictureUrl: profile_picture_url,
      }; // Return the required fields
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
