import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { useNotification } from '../hooks'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = () => {
  const dispatch = useDispatch()
  const showInfo = useNotification()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await loginService
        .login({
          username,
          password,
        })
        .then((user) => {
          blogService.setToken(user.token)
          dispatch(setUser(user))
          window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
          showInfo(`User "${user.name}" is logged in`)
        })
      setUsername('')
      setPassword('')
    } catch (exception) {
      showInfo('Wrong username or password', true)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm