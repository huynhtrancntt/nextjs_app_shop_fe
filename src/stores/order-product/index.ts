// ** Redux
import { createSlice } from '@reduxjs/toolkit'
// ** Actions
import {
  serviceName
} from 'src/stores/order-product/actions'

const initialState = {
  orderItems: []

}

export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCart: (state, action) => {

      state.orderItems = action.payload.orderItems

    },
    increaseProductToCart: (state, action) => {

      //state.orderItems = action.payload.orderItems
    },
    decreaseProductToCart: (state, action) => {
      //state.orderItems = action.payload.orderItems

    }
  },
  extraReducers: builder => { }
})

export const { updateProductToCart, increaseProductToCart, decreaseProductToCart } = orderProductSlice.actions
export default orderProductSlice.reducer
