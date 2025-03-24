import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView'
import NotificationInfo from './components/NotificationInfo'
import blogService from './services/blogs'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import Menu from './pages/Menu'
import Users from './pages/Users'
import User from './pages/User'
import Blog from './pages/Blog'
import About from './pages/About'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => {
    return state.user
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const userCookie = JSON.parse(loggedUserJSON)
      blogService.setToken(userCookie.token)
      dispatch(setUser(userCookie))
    }
  }, [])  // Só Ao recarregar a página comproba a cookie

  return (
    <Router>
      <NotificationInfo />
      {(!user || user.id === '') ? (
        <LoginForm />
      ) : (
        <>
          <Menu />
          <Routes>
            <Route path="/" element={<BlogView />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App
