import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Message = {
  senderId: string;
  text: string;
  timestamp: string;
};

type Conversation = {
  createdAt: string;
  id: string;
  lastMessage: Message;
  participants: string[];
};

interface ConversationState {
  conversations: Conversation[];
}

const initialState: ConversationState = {
  conversations: [],
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.push(action.payload);
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{ id: string; lastMessage: Message }>
    ) => {
      const { id, lastMessage } = action.payload;
      const conversation = state.conversations.find((convo) => convo.id === id);
      if (conversation) {
        conversation.lastMessage = lastMessage;
      }
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (convo) => convo.id !== action.payload
      );
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateLastMessage,
  removeConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
