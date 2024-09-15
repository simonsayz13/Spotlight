import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    userDisplayName: null,
    userProfilePhotoURL: null,
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
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
