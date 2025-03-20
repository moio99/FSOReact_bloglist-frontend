import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {text: '', error: false},
  reducers: {
    setNotificationText(state, action) {
      return action.payload
    },
    clearNotification() {
      return {text: '', error: false}
    }
  }
})

export const { setNotificationText, clearNotification } = notificationSlice.actions

// Estos som os 'action creator':

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(setNotificationText(message))

    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
