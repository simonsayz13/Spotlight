import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
interface PostState {
  posts: { [id: number]: any }; // Posts stored as objects with IDs as keys
  isAppInitilized: boolean;
}

const initialState: PostState = {
  posts: {}, // Initialize posts as an empty object
  isAppInitilized: false,
};

export const postsSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    appendPosts: (state, action: PayloadAction<any[]>) => {
      // Add only unique posts
      const newPosts = action.payload;
      newPosts.forEach((post: any) => {
        if (!state.posts[post.id]) {
          state.posts[post.id] = post;
        }
      });
    },
    incrementLikes: (state, action) => {
      const { postId } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId].likes += 1;
      }
    },
    decrementLikes: (state, action) => {
      const { postId } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId].likes -= 1;
      }
    },
    incrementFavourites: (state, action) => {
      const { postId } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId].favourites += 1;
      }
    },
    decrementFavourites: (state, action) => {
      const { postId } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId].favourites -= 1;
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts[postId];
      if (post) {
        post.comments.push(comment);
      }
    },
    updateCommentLikes: (state, action) => {
      const { postId, commentId, likes } = action.payload;
      // Access the post by ID
      const post = state.posts[postId];
      if (post && post.comments) {
        // Find the comment and update its likes
        const comment = post.comments.find(
          (comment: any) => comment.commentId === commentId
        );
        if (comment) {
          comment.likes = likes;
        }
      }
    },
    updateIsAppInitilized: (state, action) => {
      state.isAppInitilized = action.payload;
    },
  },
});

export const selectPostById = (state: RootState, postId: number) => {
  return state.posts.posts[postId] || null; // Return the post or null if not found
};

export const {
  appendPosts,
  incrementLikes,
  decrementLikes,
  incrementFavourites,
  decrementFavourites,
  addComment,
  updateCommentLikes,
  updateIsAppInitilized,
} = postsSlice.actions;

export default postsSlice.reducer;
