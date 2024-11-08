import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "./FirebaseApp";
import { FireStoreCollections } from "../Constants/dbReference";
import {
  OtherUsersState,
  setOtherUserDetails,
} from "../Redux/Slices/otherUsersSlice";
import { Dispatch } from "@reduxjs/toolkit";

const db = firestoreDB;

export const getUserProfileDetails = async (
  userId: string,
  otherUsers: OtherUsersState,
  dispatch: Dispatch
) => {
  // Access the `otherUsers` state and check if data is outdated
  const userData = otherUsers[userId];
  const isDataOutdated =
    !userData || Date.now() - userData.lastUpdated > 10 * 60 * 1000;

  // If data is fresh, return it directly
  if (userData && !isDataOutdated) {
    return {
      userId,
      displayName: userData.displayName,
      profilePictureUrl: userData.profilePictureUrl,
    };
  }

  try {
    const userRef = doc(db, FireStoreCollections.Users, userId); // Reference to the user document
    const userSnapshot = await getDoc(userRef); // Retrieve the document snapshot
    if (userSnapshot.exists()) {
      const { display_name, profile_picture_url } = userSnapshot.data(); // Destructure the fields
      const userDetails = {
        userId,
        displayName: display_name,
        profilePictureUrl: profile_picture_url,
      };
      dispatch(setOtherUserDetails(userDetails));
      return userDetails; // Return the required fields
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
