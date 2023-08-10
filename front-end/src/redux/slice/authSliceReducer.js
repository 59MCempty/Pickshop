import { createSlice } from '@reduxjs/toolkit'

const initialState = { userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null }


const authSliceReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredential: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        },
        userLogout: (state) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        },
        userRegister: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        }
    }

})

export const { setCredential, userLogout, userRegister } = authSliceReducer.actions

export default authSliceReducer.reducer
