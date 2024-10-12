import { createSelector } from "reselect";

// Input selector to get the messages state
const selectMessagesState = (state: any) => state.chats.messages;

// Memoized selector to get the messages of a specific chat room by ID
export const selectMessagesByChatRoomId = (chatRoomId: string) =>
  createSelector([selectMessagesState], (messages) => {
    return messages[chatRoomId] || []; // Return messages for the specific chat room or an empty array
  });
