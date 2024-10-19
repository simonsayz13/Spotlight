import {
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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestoreDB } from "./FirebaseApp";
import {
  FireStoreAction,
  FireStoreCollections,
  FireStorePostField,
} from "../Constants/dbReference";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native";
import store from "../Redux/store";
import { addComment, addReply } from "../Redux/Slices/postsSlices";
import { UserDetails } from "../type/Messenger";

const db = firestoreDB;

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

export const getUserDetails = async (userId: string) => {
  try {
    const userProfileCollection = doc(db, FireStoreCollections.Users, userId);
    const userDoc = await getDoc(userProfileCollection);
    // if (userDoc.exists()) return userDoc.data();

    if (userDoc.exists()) {
      const { followers: followersRef, followings: followingsRef } =
        userDoc.data();

      let followers = [];
      let followings = [];

      //* Retrieve followers array
      if (followersRef && followersRef.length > 0) {
        // Retrieve all the users being followed
        followers = await Promise.all(
          followersRef.map(async (userRef) => {
            const followerSnap = await getDoc(userRef);
            return followerSnap.data().user_id;
          })
        );
      }
      //* Retrieve followings array
      if (followingsRef && followingsRef.length > 0) {
        // Retrieve all the users being followed
        followings = await Promise.all(
          followingsRef.map(async (userRef) => {
            const followingSnap = await getDoc(userRef);
            return followingSnap.data().user_id;
          })
        );
      }
      return { ...userDoc.data(), followers, followings };
    }
  } catch (error) {
    Alert.alert("Error", "Error fetching user profile");
  }
};

export const createPost = async (userId: string, postData: any) => {
  try {
    const postId = uuidv4();
    await setDoc(doc(db, FireStoreCollections.Posts, postId), {
      ...postData,
      user_id: userId,
    });
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

//TODO - apply a proper partial match search
export const getPostsBySearch = async (searchText: string = "") => {
  try {
    const postsCollection = collection(db, FireStoreCollections.Posts);
    const q = query(
      postsCollection,
      where("title", ">=", searchText),
      where("title", "<=", searchText + "\uf8ff")
      // orderBy("timeStamp", "desc")
    );
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

export const addCommentToPost = async (
  postId: string,
  userId: string,
  displayName: string,
  userProfilePhotoURL: string,
  commentText: string
) => {
  try {
    // Reference to the specific post document in Firestore
    const postRef = doc(db, FireStoreCollections.Posts, postId);

    // Construct the comment object to add
    const newComment = {
      commentId: Date.now().toString(), // Unique ID for the comment
      userId: userId,
      displayName: displayName,
      text: commentText,
      profilePhotoUrl: userProfilePhotoURL,
      timeStamp: new Date().toISOString(),
    };

    // Use the update function with arrayUnion to add the new comment
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });

    store.dispatch(addComment({ postId, comment: newComment }));
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

export const addReplyToComment = async (
  postId: string,
  commentId: string,
  userId: string,
  displayName: string,
  userProfilePhotoURL: string,
  commentText: string
) => {
  try {
    // Reference to the specific post document in Firestore
    const postRef = doc(db, FireStoreCollections.Posts, postId);

    // Fetch the current post data
    const postSnapshot = await getDoc(postRef);

    const newReply = {
      replyId: Date.now().toString(), // Unique ID for the reply
      userId: userId,
      displayName: displayName,
      text: commentText,
      profilePhotoUrl: userProfilePhotoURL,
      timeStamp: new Date().toISOString(),
    };

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();

      // Find the comment to which the reply should be added
      const comments = postData.comments.map((comment: any) => {
        if (comment.commentId === commentId) {
          // If the comment matches, add the reply to its replies array

          // If the comment doesn't have a replies array, initialize it
          const updatedReplies = comment.replies
            ? [...comment.replies, newReply]
            : [newReply];

          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      });

      // Update the post document with the modified comments array
      await updateDoc(postRef, { comments });

      store.dispatch(addReply({ postId, commentId, reply: newReply }));
    } else {
      console.error("Post not found!");
    }
  } catch (error) {
    console.error("Error adding reply: ", error);
  }
};

export const searchUsers = async (searchQuery: string) => {
  const userRef = collection(db, FireStoreCollections.Users);
  const q = query(userRef, where("display_name", ">=", searchQuery));
  const querySnapshot = await getDocs(q);

  const users: Array<UserDetails> = [];

  querySnapshot.forEach((doc) => {
    const { display_name, profile_picture_url } = doc.data();
    users.push({
      userId: doc.id,
      display_name,
      profile_picture_url,
    });
  });

  return users;
};

export const addFollower = async (userId: string, followerUserId: string) => {
  try {
    const userRef = doc(db, "users", userId); // Reference to user1
    const followerUserRef = doc(db, "users", followerUserId); // Reference to user2

    await updateDoc(userRef, {
      followers: arrayUnion(followerUserRef), // Add reference to followers array
    });

    await updateDoc(followerUserRef, {
      followings: arrayUnion(userRef), // Add reference to followings array
    });

    console.log("Followed successfully");
  } catch (error) {
    console.error("Error adding follower:", error);
  }
};

export const removeFollower = async (
  userId: string,
  followerUserId: string
) => {
  try {
    const userRef = doc(db, "users", userId); // Reference to user1
    const followerUserRef = doc(db, "users", followerUserId); // Reference to user2

    await updateDoc(userRef, {
      followers: arrayRemove(followerUserRef), // Remove reference from followers array
    });
    await updateDoc(followerUserRef, {
      followings: arrayRemove(userRef), // Add reference to followings array
    });

    console.log("Unfollowed successfully");
  } catch (error) {
    console.error("Error adding follower:", error);
  }
};

export const getLocationPosts = async () => {
  const postsRef = collection(db, FireStoreCollections.Posts); // Reference to the 'posts' collection

  // Create a query to find all documents where isLocation is true
  const q = query(
    postsRef,
    where("isLocation", "==", true),
    where("isPrivate", "==", false)
  );

  try {
    const querySnapshot = await getDocs(q); // Execute the query
    const locationPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      postData: doc.data(),
    })); // Map through docs

    return locationPosts; // Return the array of posts with location enabled
  } catch (error) {
    console.error("Error fetching location posts: ", error);
    return [];
  }
};
