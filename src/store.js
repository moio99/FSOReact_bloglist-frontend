import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
/* import anecReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer' */

const store = configureStore({
  reducer: {
    notification: notificationReducer/* ,
    anecdotes: anecReducer,
    filter: filterReducer */
  }
})

export default store