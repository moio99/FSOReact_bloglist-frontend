import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      setTitle('')
      setAuthor('')
      setPublished('')
      setGenres([])
      setGenre('')
    }
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
          author,
          published: parseInt(published),
          genres
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