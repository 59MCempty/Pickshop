import { createSlice } from '@reduxjs/toolkit'

import { updateCart } from '../../utils/cartUtil.js'

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { cartItems: [], shippingAddress: {}, payment: [] }

const cartSliceReducer = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((x) => x._id === item._id)
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x)
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            updateCart(state)
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)

            return updateCart(state)
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            updateCart(state)
        },
        paymentMethod: (state, action) => {
            state.payment = action.payload
            updateCart(state)
        },
        clearCart: (state) => {
            state.cartItems = []
            updateCart(state)
        }
    }
})

export const { addToCart, removeFromCart, saveShippingAddress, paymentMethod, clearCart } = cartSliceReducer.actions

export default cartSliceReducer.reducer
