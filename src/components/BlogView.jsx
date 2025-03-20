import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { useNotification } from '../hooks'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { clearUser } from '../reducers/userReducer'

const BlogView = () => {
  const [blogs, setBlogs] = useState([])

  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const showInfo = useNotification()
  const user = useSelector(state => {
    return state.user
  })
  
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])  // Carregase ao chegar à páxina

  const onLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }
  
  const handleSaveBlog = (changedBlogs, message, isError) => {
    setBlogs(changedBlogs)
    showInfo(message, isError)
    if (!isError) {
      blogFormRef.current.toggleVisibility()
    }
  }
  
  const handleSaveBlogLike = (newblog, message, isError) => {
    // Nom é necesario porque newblog nom é umha copia
    // const newBlogs = blogs.map(b => (b.id === newblog.id ? newblog : b))
    // setBlogs(newBlogs)
    showInfo(message, isError)
  }
  
  const handleRemoveBlog = (idBlog, message, isError) => {
    const newBlogs = blogs.filter((b) => b.id !== idBlog)
    setBlogs(newBlogs)
    showInfo(message, isError)
  }
  
  return (
    <>
      <h2>blogs</h2>
      <div>
        {user.name} logged in <button onClick={() => onLogout()}>logout</button>
      </div>
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm blogs={blogs} user={user} onSaveBlog={handleSaveBlog} />
        </Togglable>
      </div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            onChangeLikesBlog={handleSaveBlogLike}
            onRemoveBlog={handleRemoveBlog}
          />
        ))}
    </>
  )
}

export default BlogView