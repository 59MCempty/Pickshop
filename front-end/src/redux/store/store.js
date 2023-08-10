import {configureStore} from '@reduxjs/toolkit'

import { apiSlice } from '../slice/apiSlice.js'
import cartReducer from '../slice/cartSliceReducer.js'
import userSliceReducer from '../slice/authSliceReducer.js'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]:  apiSlice.reducer,
        cart: cartReducer,
        auth: userSliceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store
