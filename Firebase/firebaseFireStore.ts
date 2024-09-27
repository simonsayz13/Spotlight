import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  increment,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import app from "./FirebaseApp";
import {
  FireStorageFolder,
  FireStoreAction,
  FireStoreCollections,
  FireStorePostField,
} from "../Constants/dbReference";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native";

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

export const fetchUserProfile = async (userId: string) => {
  try {
    const userProfileCollection = doc(db, FireStoreCollections.Users, userId);
    const userDoc = await getDoc(userProfileCollection);
    if (userDoc.exists()) return userDoc.data();
  } catch (error) {
    Alert.alert("Error", "Error fetchhing user profile");
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
    const postsCollection = collection(db, FireStoreCollections.Posts);
    const q = query(postsCollection, where("user_id", "==", userId));
    const snapshot = await getDocs(q);
    const postsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return postsList;
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return [];
  }
};

export const getAllPosts = async () => {
  try {
    const postsCollection = collection(db, FireStoreCollections.Posts);
    const q = query(postsCollection, orderBy("timeStamp", "desc"));
    const snapshot = await getDocs(q);
    const postsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return postsList;
  } catch (error) {
    return [];
  }
};

export const fetchUserDetails = async (userId: string) => {
  try {
    const userDocRef = doc(db, FireStoreCollections.Users, userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    return null; // Return null on error
  }
};

export const updatePostMetric = async (
  postId: string,
  metric: FireStorePostField,
  action: FireStoreAction
) => {
  const postRef = doc(db, FireStoreCollections.Posts, postId);

  try {
    let func;
    if (action === FireStoreAction.Increment) func = increment(1);
    if (action === FireStoreAction.Decrement) func = increment(-1);
    await updateDoc(postRef, {
      [metric]: func,
    });
  } catch (error) {
    console.error("Error incrementing field: ", error);
  }
};

export const updateUserPostMetric = async (
  userId: string,
  metric: FireStorePostField,
  postId: string,
  action: FireStoreAction
) => {
  const metricRef = doc(
    db,
    `${FireStoreCollections.Users}/${userId}/${metric}`,
    postId
  );

  try {
    let func;
    if (action === FireStoreAction.Add)
      func = setDoc(metricRef, {
        liked: true,
        timestamp: Timestamp.now(),
      });

    if (action === FireStoreAction.Remove) func = await deleteDoc(metricRef);

    await func;
  } catch (error) {
    console.error("Error updating user post metric:", error);
  }
};

export const hasUserInteractedWithPost = async (
  userId: string,
  metric: FireStorePostField,
  postId: string
) => {
  const metricRef = doc(
    db,
    `${FireStoreCollections.Users}/${userId}/${metric}`,
    postId
  );

  try {
    const docSnapshot = await getDoc(metricRef);
    return docSnapshot.exists(); // Returns true if the user has liked the post
  } catch (error) {
    console.error("Error checking liked status:", error);
    return false;
  }
};

export const getPostMetrics = async (
  postId: string,
  metric: FireStorePostField
) => {
  const postRef = doc(db, FireStoreCollections.Posts, postId);

  try {
    const postSnapshot = await getDoc(postRef); // Retrieve the document snapshot

    if (postSnapshot.exists()) {
      const fieldValue = postSnapshot.get(metric); // Get the specific field value
      return fieldValue; // Return the field value
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching field value: ", error);
    return null;
  }
};
