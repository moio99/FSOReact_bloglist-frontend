import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
// import { updateCache } from '../App'

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name born
      }
      published
      genres
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState('Demons')
  const [author, setAuthor] = useState('Fyodor Dostoevsky')
  const [published, setPublished] = useState('1872')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState(['classic', 'revolution'])

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      console.log('update000000000000')
      setTitle('')
      setAuthor('')
      setPublished('')
      setGenres([])
      setGenre('')
    },
    /* update: (cache, response) => {
      console.log('update1111111111', response.data)
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    }, */
  })

  if (!props.show) {
    return null
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const submit = async (event) => {
    event.preventDefault()

    if (!title || !author || !published || genres.length === 0) {
      alert("All fields are required")
      return
    }

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')

    try {
      const bookAdded = await addBook({
        variables: {
          title,
          author: author.length > 0 ? author : undefined,
          published: genres.length > 0 ? parseInt(published) : undefined,
          genres: genres.length > 0 ? genres : undefined
        }
      })
      console.log('bookAdded', bookAdded)
    } catch (err) {
      console.error("Error al añadir el libro:", err.message)
    }
  }

  const addGenre = () => {
    if (genre.trim() && !genres.includes(genre)) {
      setGenres([...genres, genre])
      setGenre('')
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook