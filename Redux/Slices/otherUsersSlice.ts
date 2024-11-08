import { createSlice } from "@reduxjs/toolkit";

interface UserDetails {
  displayName: string;
  profilePictureUrl: string;
  lastUpdated: number;
}

export interface OtherUsersState {
  [userId: string]: UserDetails;
}

const initialState: OtherUsersState = {};

const otherUsersSlice = createSlice({
  name: "otherUsers",
  initialState,
  reducers: {
    setOtherUserDetails: (state, action) => {
      const { userId, displayName, profilePictureUrl } = action.payload;
      state[userId] = {
        displayName,
        profilePictureUrl,
        lastUpdated: Date.now(),
      };
    },
    clearOtherUserDetails: (state, action) => {
      const { userId } = action.payload;
      delete state[userId];
    },
  },
});

export const { setOtherUserDetails, clearOtherUserDetails } =
  otherUsersSlice.actions;

export default otherUsersSlice.reducer;
