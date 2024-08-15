// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { registerAuthAsync } from './actions'
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
  isSussess: true,
  isError: false,
  message: "",
  typeError: ""

}
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    resetInitialState: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true;

    })
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      console.log(action);

      state.isLoading = false;
      state.isSussess = !!action?.payload?.data?.email;
      state.isError = !action?.payload?.data?.email;
      state.message = action?.payload?.message;
      state.typeError = action?.payload?.typeError;

    })
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.isSussess = false;
      state.isError = true;
      state.message = "";
      state.typeError = "";
    })
  }
})

export const { resetInitialState } = authSlice.actions
export default authSlice.reducer
