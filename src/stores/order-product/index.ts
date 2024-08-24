// ** Redux
import { createSlice } from '@reduxjs/toolkit'
// ** Actions
import {
  createOrderProductAsync,
  serviceName
} from 'src/stores/order-product/actions'

const initialState = {
  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  isLoading: false,
  typeError: '',
  orderItems: []
}

export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCart: (state, action) => {

      state.orderItems = action.payload.orderItems

    },
    resetInitialState: state => {
      state.isSuccessCreate = false
      state.isErrorCreate = true
      state.messageErrorCreate = ''
      state.typeError = ''
      state.isLoading = false
    }
  },
  extraReducers: builder => {
    // ** create order product
    builder.addCase(createOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action.payload?.data?._id
      state.isErrorCreate = !action.payload?.data?._id
      state.messageErrorCreate = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { updateProductToCart, resetInitialState } = orderProductSlice.actions
export default orderProductSlice.reducer
