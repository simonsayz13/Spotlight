import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
  name: "user",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    incrementLikes: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((post: any) => post.id === postId);
      if (post) {
        //@ts-ignore
        post.likes += 1;
      }
    },
    decrementLikes: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((post: any) => post.id === postId);
      if (post) {
        //@ts-ignore
        post.likes -= 1;
      }
    },
    incrementFavourites: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((post: any) => post.id === postId);
      if (post) {
        //@ts-ignore
        post.favourites += 1;
      }
    },
    decrementFavourites: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((post: any) => post.id === postId);
      if (post) {
        //@ts-ignore
        post.favourites -= 1;
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;

      // Find the specific post by ID
      const post = state.posts.find((post: any) => post.id === postId);

      if (post) {
        // Push the new comment to the comments array
        //@ts-ignore
        post.comments.push(comment);
        console.log(comment);
      }
    },
  },
});

export const {
  setPosts,
  incrementLikes,
  decrementLikes,
  incrementFavourites,
  decrementFavourites,
  addComment,
} = postsSlice.actions;

export default postsSlice.reducer;
