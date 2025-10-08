import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../../utils/requests';

// Thunk fetch user
export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {

  try {
    const result = await GET("/user/info");
    return result;
  } catch (error) {
    throw new Error(error.message || 'Fetch failed');
  }
});

const initialState = {
  isLoggedIn: false,
  permissions: [],
  user: null,
  token: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.permissions = user.permissions || [];
      state.token = token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.permissions = [];
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.permissions = action.payload.user.permissions || [];
        state.isLoggedIn = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;  
        state.permissions = [];
        state.token = null;
      });
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
