/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from '@/models/auth.model';
import { AsyncThunk, createSlice } from '@reduxjs/toolkit';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

interface AuthSlice {
  user: IUser;
}

const initialState: AuthSlice = {
  user: {} as IUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const { setUserInfo } = authSlice.actions;

export default authSlice.reducer;
