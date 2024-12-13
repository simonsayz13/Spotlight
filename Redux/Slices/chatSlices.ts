import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface ChatState {
  messages: {
    [chatRoomId: string]: Message[];
  };
}

const initialState: ChatState = {
  messages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ chatRoomId: string; messages: Message[] }>
    ) => {
      const { chatRoomId, messages } = action.payload;
      state.messages[chatRoomId] = messages;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatRoomId: string; message: Message }>
    ) => {
      const { chatRoomId, message } = action.payload;
      if (!state.messages[chatRoomId]) {
        state.messages[chatRoomId] = [];
      }
      state.messages[chatRoomId].push(message);
    },
    deleteChatRoom: (
      state,
      action: PayloadAction<string> // chatRoomId as the payload
    ) => {
      const chatRoomId = action.payload;
      delete state.messages[chatRoomId]; // Remove the chat room from state.messages
    },
  },
});

export const { setMessages, addMessage, deleteChatRoom } = chatSlice.actions;

export default chatSlice.reducer;
