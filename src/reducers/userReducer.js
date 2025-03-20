import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {id: '', name: '', userName: '', token: ''},
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return {id: '', name: '', userName: '', token: ''}
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

// Cá iriam os 'action creator':

export default userSlice.reducer
