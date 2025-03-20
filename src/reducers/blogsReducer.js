import { createSlice } from '@reduxjs/toolkit'

const initialState = [] 

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload 
    },
    addBlog(state, action) {
      console.log('addBlog', action.payload)
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog))
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload) 
    },
    /* clearBlogs() {
      return initialState 
    } */
  }
})

export const { setBlogs, addBlog, updateBlog, deleteBlog, clearBlogs } = blogsSlice.actions

export default blogsSlice.reducer
