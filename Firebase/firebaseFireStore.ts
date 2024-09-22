import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "./FirebaseApp";
import { FireStoreCollections } from "../Constants/dbReference";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore(app);

export const createUserProfile = async (
  userId: string,
  displayName: string
) => {
  try {
    await setDoc(doc(db, FireStoreCollections.Users, userId), {
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

export const createPost = async (userId: string, postData: any) => {
  try {
    const postId = uuidv4();
    const docRef = await setDoc(doc(db, FireStoreCollections.Posts, postId), {
      ...postData,
      user_id: userId,
    });
    console.log("Document written with Ref: ", docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getPostsByUserId = async (userId: string) => {
  try {
    // Reference the 'posts' collection
    const postsCollection = collection(db, "posts");

    // Create a query to filter documents where 'authorId' is equal to the specified value
    const q = query(postsCollection, where("user_id", "==", userId));

    // Execute the query and get the snapshot of matching documents
    const querySnapshot = await getDocs(q);

    // Array to store the retrieved posts
    let posts: Array<any> = [];

    // Loop through each document in the snapshot and extract the data
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    // Return the list of posts
    return posts;
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return [];
  }
};
