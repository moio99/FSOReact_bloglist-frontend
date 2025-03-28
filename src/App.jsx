import { useState } from "react"
import { useApolloClient } from '@apollo/client'
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Recommendations from "./components/Recommendations"
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import './index.css'


/* export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  console.log('updateCache222222222222qqqqq', query)
  console.log('updateCache222222222222', addedBook)
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBook }) => {
    console.log('updateCache333333333333', allBook)
    return {
      allBook: uniqByName(allBook.concat(addedBook)),
    }
  })
} */

const App = () => {
  const [token, setToken] = useState(null)
  const [userGenre, setUserGenre] = useState('')
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const loginSuccess = (token, favoriteGenre) => {
    setToken(token)
    setUserGenre(favoriteGenre)
    setPage('authors')
  }

  const logout = () => {
    setToken(null)
    setUserGenre('')
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    console.log('notify', message)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {userGenre !== '' && <button onClick={() => setPage('recommendations')}>recommend</button>}
        {token && <button onClick={() => logout()}>logout</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} setError={notify} login={!!token} />
      <Books show={page === 'books'} login={!!token} />
      <Recommendations show={page === 'recommendations'} favoriteGenre={userGenre} />
      <NewBook show={page === 'add'} />
      <LoginForm show={page === 'login'} loginSuccess={loginSuccess} setError={notify} />
    </div>
  )
}

export default App
