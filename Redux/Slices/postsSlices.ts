import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    isAppInitilized: false,
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
      const post: any = state.posts.find((post: any) => post.id === postId);
      if (post) {
        post.favourites -= 1;
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post: any = state.posts.find((post: any) => post.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    updateCommentLikes: (state, action) => {
      const { postId, commentId, likes } = action.payload;
      const post: any = state.posts.find((post: any) => post.id === postId);
      if (post) {
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

export const {
  setPosts,
  incrementLikes,
  decrementLikes,
  incrementFavourites,
  decrementFavourites,
  addComment,
  updateCommentLikes,
  updateIsAppInitilized,
} = postsSlice.actions;

export default postsSlice.reducer;
