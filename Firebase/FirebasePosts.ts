import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { firestoreDB } from "./FirebaseApp";
import { FireStoreCollections } from "../Constants/dbReference";
import { getBoundingBox } from "../Util/utility";

export const getPaginatedPosts = async (lastVisible?: any) => {
  const { minLat, maxLat, minLon, maxLon } = await getBoundingBox(5);
  try {
    const postsCollection = collection(firestoreDB, FireStoreCollections.Posts);
    const q = lastVisible
      ? query(
          postsCollection,
          where("isPrivate", "==", false),
          where("coordinates.latitude", ">=", minLat),
          where("coordinates.latitude", "<=", maxLat),
          where("coordinates.longitude", ">=", minLon),
          where("coordinates.longitude", "<=", maxLon),
          orderBy("isPrivate", "asc"),
          orderBy("coordinates.latitude", "asc"),
          orderBy("coordinates.longitude", "asc"),
          orderBy("timeStamp", "desc"),
          startAfter(lastVisible),
          limit(10)
        )
      : query(
          postsCollection,
          where("isPrivate", "==", false),
          where("coordinates.latitude", ">=", minLat),
          where("coordinates.latitude", "<=", maxLat),
          where("coordinates.longitude", ">=", minLon),
          where("coordinates.longitude", "<=", maxLon),
          orderBy("isPrivate", "asc"),
          orderBy("coordinates.latitude", "asc"),
          orderBy("coordinates.longitude", "asc"),
          orderBy("timeStamp", "desc"),
          limit(10)
        );

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
    if (!newLastVisible) throw Error;
    return { posts, lastVisible: newLastVisible };
  } catch (error) {
    return { posts: [], lastVisible: null };
  }
};

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

export const getNearbyPosts = async (radius: number) => {
  const { minLat, maxLat, minLon, maxLon } = await getBoundingBox(radius);

  try {
    const postsCollection = collection(firestoreDB, FireStoreCollections.Posts);
    // Query Firestore for posts with document IDs in the provided array
    const postsQuery = query(
      postsCollection,
      where("coordinates.latitude", ">=", minLat),
      where("coordinates.latitude", "<=", maxLat),
      where("coordinates.longitude", ">=", minLon),
      where("coordinates.longitude", "<=", maxLon)
    );
    // Filter out any null results (non-existent posts)
    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map((doc) => doc.data());
    return posts;
  } catch (error) {
    console.error("Error fetching nearby posts:", error);
  }
};
