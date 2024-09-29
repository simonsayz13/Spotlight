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
  },
});

export const {
  setPosts,
  incrementLikes,
  decrementLikes,
  incrementFavourites,
  decrementFavourites,
} = postsSlice.actions;

export default postsSlice.reducer;
