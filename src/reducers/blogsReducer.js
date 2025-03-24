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
    addComment(state, action) {
      const addedComment = action.payload
      return state.map(blog => (blog.id !== addedComment.blog.id ? blog : {
        ...blog, comments: blog.comments.concat(addedComment)
      }))
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
    /* clearBlogs() {
      return initialState
    } */
  }
})

export const { setBlogs, addBlog, updateBlog, addComment, deleteBlog, clearBlogs } = blogsSlice.actions

export default blogsSlice.reducer
