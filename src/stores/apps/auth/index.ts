// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { registerAuthAsync, updateAuthMeAsync } from './actions'
import { is } from 'immutable'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: "",
  typeError: "",
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: "",

}
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    resetInitialState: () => initialState
  },
  extraReducers: builder => {
    // ** Register
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true;

    })
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = !!action?.payload?.data?.email;
      state.isError = !action?.payload?.data?.email;
      state.message = action?.payload?.message;
      state.typeError = action?.payload?.typeError;

    })
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = "";
      state.typeError = "";
    })
    // ** Update auth me
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      state.isLoading = true;

    })
    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
      ;

      state.isLoading = false;
      state.isSuccessUpdateMe = !!action?.payload?.data?.email;
      state.isErrorUpdateMe = !action?.payload?.data?.email;
      state.messageUpdateMe = action?.payload?.message;
      state.typeError = action?.payload?.typeError;

    })
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccessUpdateMe = false;
      state.isErrorUpdateMe = false;
      state.messageUpdateMe = "";
      state.typeError = "";
    })
  }
})

export const { resetInitialState } = authSlice.actions
export default authSlice.reducer
