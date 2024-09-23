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
    updateUser: (state, action) => {
      const {
        user_id,
        display_name,
        profile_picture_url,
        biography,
        age,
        gender,
        location,
      } = action.payload;
      state.userDisplayName = display_name;
      state.userId = user_id;
      state.userProfilePhotoURL = profile_picture_url;
      state.userBio = biography;
      state.userAge = age;
      state.userGender = gender;
      state.userLocation = location;
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
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
