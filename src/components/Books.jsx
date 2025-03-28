import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, DELETE_BOOK } from '../queries'

const Books = ({ show, login }) => {
  const [uniqueGenres, setUniqueGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)

  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      if (data && data.allBooks) {
        const genreSet = new Set()
        data.allBooks.forEach(book => {
          book.genres.forEach(genre => genreSet.add(genre))
        })
  
        const uniqueGenresList = Array.from(genreSet)
        setUniqueGenres(uniqueGenresList)
      }
    },
    skip: !show,
    fetchPolicy: "network-only"
  })

  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: ['ALL_BOOKS'],
    onCompleted: () => {
      console.log('delete livro 000000000000')
      refetch() // Provoca que se volte a carregar o listado de livros
    },
    onError: (error) => {
      console.error("Error al eliminar el libro:", error)
    },
  })

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, refetch])

  if (!show) {
    return null
  }

  const handleDelete = async (title) => {
    console.log('handleDelete', title)

    try {
      const { data } = await deleteBook({ variables: { title } })
      if (data.deleteBook) {
        console.log(`Libro "${title}" eliminado correctamente.`)
      } else {
        console.log("No se pudo eliminar el libro.")
      }
    } catch (error) {
      console.error("Error en la mutación:", error)
    }
  }
  
  const filteredBooks = selectedGenre
    ? data?.allBooks.filter(book => book.genres.includes(selectedGenre))
    : data?.allBooks

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th></th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name}</td>
              <td>{a.published}</td>
              <td>
                {login && <button onClick={() => handleDelete(a.title)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <div>
          {uniqueGenres.map(genre => (
            <button key={genre} onClick={() => setSelectedGenre(genre)}>
              {genre}
            </button>
          ))}
        </div>
        <div>
          <button onClick={() => setSelectedGenre(null)}>All genres</button>
        </div>
      </div>
    </div>
  )
}

export default Books
