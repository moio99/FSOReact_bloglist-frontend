import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { useNotification } from '../hooks'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { clearUser } from '../reducers/userReducer'
import { setBlogs, addBlog, deleteBlog, updateBlog } from '../reducers/blogsReducer'

const BlogView = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const showInfo = useNotification()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)))
  }, [])  // Carregase ao chegar à páxina

  const onLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }

  const handleSaveBlog = (changedBlogs, message, isError) => {
    console.log('handleSaveBlog', changedBlogs)
    dispatch(addBlog(changedBlogs))
    console.log('handleSaveBlog2', changedBlogs)
    showInfo(message, isError)
    if (!isError) {
      blogFormRef.current.toggleVisibility()
    }
  }

  const handleSaveBlogLike = (newblog, message, isError) => {
    dispatch(updateBlog(newblog))
    showInfo(message, isError)
  }

  const handleRemoveBlog = (idBlog, message, isError) => {
    dispatch(deleteBlog(idBlog))
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
        .slice()  // Copia a matriz antes de a ordear
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