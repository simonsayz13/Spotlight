import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FireStoreCollections } from "../Constants/dbReference";
import { firestoreDB } from "./FirebaseApp";
import { setMessages } from "../Redux/Slices/chatSlices";
import { sortConversationsByLastMessage } from "../Util/utility";
import { SetStateAction } from "react";

const db = firestoreDB;

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
  } catch (error) {
    console.error("Error sending message: ", error);
    return null;
  }
};

export const messageListener = (chatId: string, dispatch: any) => {
  const chatDocRef = doc(db, FireStoreCollections.Chats, chatId);

  // Reference the `messages` sub-collection within the specific chat document
  const messagesRef = collection(chatDocRef, FireStoreCollections.Chats);
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

  // Attach a listener to get real-time updates on the messages
  const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
    const messagesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //@ts-ignore
    dispatch(setMessages({ chatRoomId: chatId, messages: messagesList }));
  });
  return () => unsubscribe();
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
