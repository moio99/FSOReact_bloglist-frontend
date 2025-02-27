import { useState, useEffect } from 'react'
import { Blog, BlogForm } from './components/Blog'
import NotificationInfo from './components/NotificationInfo'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [actionInfo, setActionInfo] = useState({text: '', error: false})
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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

  const handleTitleChange = (event) => {
    const inputValue = event.target.value
    setNewTitle(inputValue)
  }

  const handleAuthorChange = (event) => {
    const inputValue = event.target.value
    setNewAuthor(inputValue)
  }
  
  const handleUrlChange = (event) => {
    const inputValue = event.target.value
    setNewUrl(inputValue)
  }
  const handleAddBlog = (event) => {
    event.preventDefault()

    const form = event.target
    const inputTitle = form.querySelector("input[id='title']").value
    const inputAuthor = form.querySelector("input[id='author']").value
    const inputUrl = form.querySelector("input[id='url']").value
    if (inputTitle.length > 0) {
      const blog = blogs.find(blog => blog.title.toLocaleLowerCase() === inputTitle.toLocaleLowerCase())
      if (blog) {
        updateBlog(blog, inputAuthor, inputUrl)
      } else {
        addBlog(inputTitle, inputAuthor, inputUrl)
      }
    }
  }

  const updateBlog = (blog, inputAuthor, inputUrl) => { 
    const confirmText = `The title "${blog.title}" is already added to the blog list, update the old values author: "${blog.author}" url: "${blog.url}"?` 
    if (window.confirm(confirmText)) {
      const updateBlog = {title: blog.title, author: inputAuthor, url: inputUrl, likes: blog.likes}
      blogService.update(blog.id, updateBlog)
        .then(response => {
          console.log('update', response.data)
          setBlogs(blogs.map(b => (b.id === blog.id ? response.data : b)))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          showInfo(`Updated blog: "${response.data.title}"!`)
        })
        .catch(error => { 
          console.log('UpdateError', error.response.data.error)
          if (error.response.status === 400) {
            showInfo(error.response.data.error, true) 
          } else {
            showInfo(`Error on update "${blog.title}"`, true) 
          }
        })
    }
  }

  const addBlog = (inputTitle, inputAuthor, inputUrl) => { 
    const newBlog = {title: inputTitle, author: inputAuthor, url: inputUrl}
    blogService.create(newBlog)
      .then(response => {
        console.log('create', response.data)
        setBlogs(blogs.concat(response.data))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        showInfo(`Added blog title: "${response.data.title}"!`)
      })
      .catch(error => {
        console.log('CreateError', error.response.data.error)
        if (error.response.status === 400) {
          showInfo(error.response.data.error, true) 
        } else {
          showInfo(`Error on create ""${blog.title}"`, true)
        }
      })
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
        <BlogForm
          newTitle={newTitle} newAuthor={newAuthor} newUrl={newUrl}
          onAddBlog={handleAddBlog} 
          onTitleChange={handleTitleChange} onAuthorChange={handleAuthorChange} onUrlChange={handleUrlChange} />
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