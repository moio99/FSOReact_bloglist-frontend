import { createSlice } from '@reduxjs/toolkit'

const initialState = { id: '', name: '', userName: '', token: '' }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return initialState
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

// Cá iriam os 'action creator':

export default userSlice.reducer
