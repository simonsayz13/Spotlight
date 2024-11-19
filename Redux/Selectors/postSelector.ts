import { createSelector } from "reselect";

// Input selector to get the posts state
const selectPostsState = (state: any) => state.posts.posts;

// Memoized selector to get the comments of a specific post by ID
export const selectCommentsByPostId = (postId: string) =>
  createSelector([selectPostsState], (posts) => {
    return posts[postId]?.comments || []; // Directly access the post by its ID and return comments
  });
