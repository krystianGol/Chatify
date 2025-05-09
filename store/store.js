import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice';
import userSlice from './userSlice';
import chatsSlice from './chatSlice';
import messagesSlice from "./messagesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    chats: chatsSlice,
    messages: messagesSlice,
  },
})