import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDB } from "./FirebaseApp";
import { FireStoreCollections } from "../Constants/dbReference";

export const getPostsByUserIdArray = async (postIds: Array<string>) => {
  try {
    const postsCollection = collection(firestoreDB, FireStoreCollections.Posts);
    // Query Firestore for posts with document IDs in the provided array
    const querySnapshot = await Promise.all(
      postIds.map(async (postId) => {
        const postDoc = await getDocs(
          query(postsCollection, where("__name__", "==", postId))
        );
        return postDoc.docs.length > 0
          ? { id: postId, ...postDoc.docs[0].data() }
          : null;
      })
    );
    // Filter out any null results (non-existent posts)
    const posts = querySnapshot.filter((post) => post !== null);
    return posts;
  } catch (error) {
    console.error("Error fetching posts by IDs:", error);
    throw new Error("Failed to fetch posts. Please try again later.");
  }
};
