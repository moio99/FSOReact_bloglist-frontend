import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearUser } from '../reducers/userReducer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

const Menu = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const onLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }

  const buttonStyle = {
    '&:hover': { color: 'black', backgroundColor: '#663399' }
  }
  const loggedIn = {
    paddingRight: 5,
    paddingLeft: 5,
    fontStyle: 'italic'
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/" sx={buttonStyle}>home</Button>
        <Button color="inherit" component={Link} to="/users" sx={buttonStyle}>Users</Button>
        <Button color="inherit" component={Link} to="/about" sx={buttonStyle}>About</Button>
        {user.name}<span style={loggedIn}>logged in</span> <button onClick={() => onLogout()}>logout</button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu