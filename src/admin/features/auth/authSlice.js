import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../../utils/requests';

// Thunk fetch user
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, {getState, rejectWithValue}) => {

  try {
    // call api lấy thông tin user dựa trên token gửi kèm
    const result = await GET(`/api/v1/admin/my-accounts`);
    // console.log(result);
    const user = {
      user: {
        ...result.data
      },
      token: result.data.token
    }
    return user;

  } catch (error) {
    return rejectWithValue(error.message || 'Fetch failed');
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
      // console.log(action.payload);
      // Chỉ cần tạo ra action còn thunk sẽ xử lý
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
        state.user = { ...state.user, ...action.payload.user };
        state.permissions = action.payload.user.permissions || [];
        state.isLoggedIn = true;
        state.token = action.payload.token;
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
