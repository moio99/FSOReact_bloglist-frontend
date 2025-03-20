import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView'
import NotificationInfo from './components/NotificationInfo'
import blogService from './services/blogs'

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
  }, [])  // Ao recarregar a página comproba a cookie

  return (
    <div>
      <NotificationInfo />
      {(user === null || user.id === '') && <LoginForm />}
      {user !== null && user.id !== '' && <BlogView />}
    </div>
  )
}

export default App
