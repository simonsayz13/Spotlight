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
    userEducation: null,
  },
  reducers: {
    setUser: (state, action) => {
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
      state.userEducation = null;
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
    updateEducation: (state, action) => {
      state.userEducation = action.payload;
    },
    updateAge: (state, action) => {
      state.userAge = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  updateDisplayName,
  updateBio,
  updateProfilePhotoURL,
  updateGender,
  updateLocation,
  updateEducation,
  updateAge,
} = userSlice.actions;

export default userSlice.reducer;
