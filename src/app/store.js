import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../admin/features/auth/authSlice';
import { authMiddleware } from '../admin/features/auth/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
