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
  arrayUnion,
  addDoc,
  onSnapshot,
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
import store from "../Redux/store";
import { addComment } from "../Redux/Slices/postsSlices";
import { SetStateAction } from "react";
import { sortConversationsByLastMessage } from "../Util/utility";

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

export const getUserDetails = async (userId: string) => {
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

export const createOrGetChatRoom = async (
  user1Id: string,
  user2Id: string,
  setChatRoomId: SetStateAction<any>
) => {
  try {
    // Create a unique chat ID by sorting the user IDs
    const sortedUserIds = [user1Id, user2Id].sort().join("_");

    // Reference the chat room with this unique ID
    const chatRoomRef = doc(
      collection(db, FireStoreCollections.Chats),
      sortedUserIds
    );

    // Check if the chat room already exists
    const chatRoomSnapshot = await getDoc(chatRoomRef);

    if (!chatRoomSnapshot.exists()) {
      // If it doesn't exist, create a new chat room
      const newChatRoom = {
        participants: [user1Id, user2Id],
        lastMessage: {},
        createdAt: new Date().toISOString(),
      };
      // Set the document with the unique ID
      await setDoc(chatRoomRef, newChatRoom);
    }
    setChatRoomId(chatRoomRef.id);
  } catch (error) {
    console.error("Error creating or getting chat room: ", error);
    throw error;
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  try {
    // Reference the chat room document
    const chatRoomRef = doc(db, FireStoreCollections.Chats, chatId);

    // Reference the messages subcollection inside the chat room
    const messagesCollectionRef = collection(
      chatRoomRef,
      FireStoreCollections.Chats
    );

    // Create a new message object
    const newMessage = {
      senderId,
      text,
      timestamp: new Date().toISOString(), // Use server timestamp for consistency
      read: false,
    };

    // Add the new message document to the messages subcollection
    const newMessageRef = doc(messagesCollectionRef); // Generate a unique document reference
    await setDoc(newMessageRef, newMessage);

    // Update the chat room's last message field
    await updateDoc(chatRoomRef, {
      lastMessage: {
        text: text,
        timestamp: new Date().toISOString(),
        senderId: senderId,
      },
    });

    return { id: newMessageRef.id, ...newMessage };
  } catch (error) {
    console.error("Error sending message: ", error);
    return null;
  }
};

export const messageListener = (
  chatId: string,
  // setChatDetails: SetStateAction<any>,
  setMessages: SetStateAction<any>
) => {
  const chatDocRef = doc(db, FireStoreCollections.Chats, chatId);

  // Reference the `messages` sub-collection within the specific chat document
  const messagesRef = collection(chatDocRef, FireStoreCollections.Chats);
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

  // Attach a listener to get real-time updates on the messages
  const subscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
    const messagesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(messagesList);
  });
  return () => subscribeMessages();
};

export const conversationListener = (
  currentUserId: string,
  setConversations: SetStateAction<any>
) => {
  const conversationsRef = collection(db, FireStoreCollections.Chats);
  const q = query(
    conversationsRef,
    where("participants", "array-contains", currentUserId)
  );
  const subscribeConversations = onSnapshot(q, (querySnapshot) => {
    const chatsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setConversations(sortConversationsByLastMessage(chatsList));
  });

  // Cleanup on component unmount
  return () => subscribeConversations();
};
