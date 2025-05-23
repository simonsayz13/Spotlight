import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    userDisplayName: null,
    userProfilePhotoURL: null,
    userBio: null,
    userAge: null,
    userGender: null,
    userLocation: null,
    userFavourites: [],
    userLiked: [],
    userFollowers: [],
    userFollowings: [],
  },
  reducers: {
    createUser: (state, action) => {
      const { userId, displayName, profileURL } = action.payload;
      state.userDisplayName = displayName;
      state.userId = userId;
      state.userProfilePhotoURL = profileURL;
    },
    clearUser: (state) => {
      state.userId = null;
      state.userDisplayName = null;
      state.userProfilePhotoURL = null;
      state.userBio = null;
      state.userGender = null;
      state.userLocation = null;
      state.userFavourites = [];
      state.userLiked = [];
      state.userFollowers = [];
      state.userFollowings = [];
    },

    updateDisplayName: (state, action) => {
      state.userDisplayName = action.payload;
    },
    updateBio: (state, action) => {
      state.userBio = action.payload;
    },
    updateProfilePhotoURL: (state, action) => {
      state.userProfilePhotoURL = action.payload;
    },
    updateGender: (state, action) => {
      state.userGender = action.payload;
    },
    updateLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    updateAge: (state, action) => {
      state.userAge = action.payload;
    },
    addToFollowings: (state, action) => {
      const userId = action.payload;
      if (!state.userFollowings.includes(userId)) {
        state.userFollowings.push(userId); // Use `push` for direct mutation
      }
    },
    removeFromFollowings: (state, action) => {
      state.userFollowings = state.userFollowings.filter(
        (el) => el !== action.payload
      );
    },
    updateUser: (state, action) => {
      const {
        user_id,
        display_name,
        profile_picture_url,
        biography,
        age,
        gender,
        location,
        followers,
        followings,
        favourites,
        liked,
      } = action.payload;

      state.userDisplayName = display_name;
      state.userId = user_id;
      state.userProfilePhotoURL = profile_picture_url;
      state.userBio = biography;
      state.userAge = age;
      state.userGender = gender;
      state.userLocation = location;
      state.userFollowers = followers;
      state.userFollowings = followings;
      state.userFavourites = favourites;
      state.userLiked = liked;
    },
    setUserLiked: (state, action) => {
      const { postId } = action.payload;
      // If the postId is not already in the `Liked` array, add it.
      if (!state.userLiked) {
        state.userLiked = [];
      }
      //@ts-ignore
      if (!state.userLiked.includes(postId)) {
        //@ts-ignore
        state.userLiked.push(postId);
      }
    },
    removeUserLiked: (state, action) => {
      const { postId } = action.payload;
      if (state.userLiked) {
        state.userLiked = state.userLiked.filter((id) => id !== postId);
      }
    },

    setUserFavourites: (state, action) => {
      const { postId } = action.payload;
      if (!state.userFavourites) {
        state.userFavourites = [];
      }
      //@ts-ignore
      if (!state.userFavourites.includes(postId)) {
        //@ts-ignore
        state.userFavourites.push(postId);
      }
    },
    removeUserFavourites: (state, action) => {
      const { postId } = action.payload;
      if (state.userFavourites) {
        state.userFavourites = state.userFavourites.filter(
          (id) => id !== postId
        );
      }
    },
  },
});

export const {
  createUser,
  clearUser,
  updateDisplayName,
  updateBio,
  updateProfilePhotoURL,
  updateGender,
  updateLocation,
  updateAge,
  addToFollowings,
  removeFromFollowings,
  updateUser,
  setUserLiked,
  removeUserLiked,
  setUserFavourites,
  removeUserFavourites,
} = userSlice.actions;

export default userSlice.reducer;
