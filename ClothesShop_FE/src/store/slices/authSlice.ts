import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    login: false,
    profile: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.login = true
            state.profile = action.payload
        },
        logout: (state) =>{
            localStorage.removeItem("accessToken")
            state.login = false
            state.profile = null
        }
    }
})

export default authSlice.reducer
export const { login, logout } = authSlice.actions