import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import NotificationInfo from './components/NotificationInfo'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [actionInfo, setActionInfo] = useState({text: '', error: false})
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

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
      setActionInfo({text: '', error: false})
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

  const handleSaveBlog = ( newblogs, message, isError ) => {
    setBlogs(newblogs)
    showInfo(message, isError)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <>
      <h2>blogs</h2>
      <div>
        {user.name} logged in <button onClick={() => onLogout()}>logout</button>
      </div>
      <div>
        <Togglable buttonLabel="new blog">
          <BlogForm blogs={blogs} onSaveBlog={handleSaveBlog} />
        </Togglable>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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