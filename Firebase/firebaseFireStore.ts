import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import app from "./FirebaseApp";
import { FireStoreCollections } from "../Constants/dbReference";

const db = getFirestore(app);

export const createUserProfile = async (
  userId: string,
  displayName: string
) => {
  try {
    const docRef = await setDoc(doc(db, FireStoreCollections.Users, userId), {
      user_id: userId,
      display_name: displayName,
    });
    console.log("Document written with ID: ", userId);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateProfileField = async (
  userId: string,
  updateField: Record<any, any>
) => {
  try {
    const docRef = doc(db, FireStoreCollections.Users, userId);
    await updateDoc(docRef, updateField);
    console.log("Document updated successfully with: ", updateField);
  } catch (error) {
    // TO-DO return meaningful modal message
    console.error("Error updating document:", error);
  }
};
