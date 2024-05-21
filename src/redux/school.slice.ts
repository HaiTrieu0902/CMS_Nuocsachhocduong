/* eslint-disable @typescript-eslint/no-unused-vars */
import { AsyncThunk, createSlice } from '@reduxjs/toolkit';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

interface SchoolSlice {
  isLoadingListSchool: boolean;
}

const initialState: SchoolSlice = {
  isLoadingListSchool: false,
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    triggerLoadingSchool: (state) => {
      state.isLoadingListSchool = !state.isLoadingListSchool;
    },
  },
  extraReducers(builder) {},
});

export const { triggerLoadingSchool } = schoolSlice.actions;

export default schoolSlice.reducer;
