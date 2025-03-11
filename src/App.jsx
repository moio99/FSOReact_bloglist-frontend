import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import NotificationInfo from './components/NotificationInfo'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [actionInfo, setActionInfo] = useState({ text: '', error: false })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const showInfo = (info, error) => {
    const newActionInfo = { text: info, error: error ? true : false  }
    setActionInfo(newActionInfo)
    setTimeout(() => {
      setActionInfo({ text: '', error: false })
    }, 5000)
  }

  const onLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await loginService.login({
        username, password,
      }).then(user => {
        blogService.setToken(user.token)
        setUser(user)
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
        showInfo(`User "${user.name}" is logged in`)
      })
      setUsername('')
      setPassword('')
    } catch (exception) {
      showInfo('Wrong username or password', true)
    }
  }

  const handleSaveBlog = ( changedBlogs, message, isError ) => {
    setBlogs(changedBlogs)
    showInfo(message, isError)
    if (!isError) {
      blogFormRef.current.toggleVisibility()
    }
  }

  const handleSaveBlogLike = ( newblog, message, isError ) => {
    // Nom é necesario porque newblog nom é umha copia
    // const newBlogs = blogs.map(b => (b.id === newblog.id ? newblog : b))
    // setBlogs(newBlogs)
    showInfo(message, isError)
  }

  const handleRemoveBlog = ( idBlog, message, isError ) => {
    const newBlogs = blogs.filter(b => b.id !== idBlog)
    setBlogs(newBlogs)
    showInfo(message, isError)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input type="text" value={username} name="Username" id='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input type="password" value={password} name="Password" id='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>
  )

  const blogForm = () => (
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
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user}
            onChangeLikesBlog={handleSaveBlogLike} onRemoveBlog={handleRemoveBlog} />
        )}
    </>
  )

  return (
    <div>
      <NotificationInfo values={actionInfo} />

      {user === null && loginForm()}
      {user !== null && blogForm()}
    </div>
  )
}

export default App