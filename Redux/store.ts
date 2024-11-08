import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/es/constants";
import postsReducer from "./Slices/postsSlices";
import chatReducer from "./Slices/chatSlices";
import otherUsersReducer from "./Slices/otherUsersSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["posts"],
};

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  chats: chatReducer,
  otherUsers: otherUsersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these specific redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
export default store;
