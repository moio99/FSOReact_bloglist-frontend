import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, DELETE_BOOK } from '../queries'

const Books = ({ show, login }) => {
  const [uniqueGenres, setUniqueGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const client = useApolloClient()

  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre ? [selectedGenre] : null },
    skip: !show,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (selectedGenre === null && data && data.allBooks) {
        const genreSet = new Set()
        data.allBooks.forEach(book => {
          book.genres.forEach(genre => genreSet.add(genre))
        })
  
        const uniqueGenresList = Array.from(genreSet)
        setUniqueGenres(uniqueGenresList)
      }
    }
  })

  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: ['ALL_BOOKS'],
    onCompleted: () => {
      console.log('borrado do livro completado')
    },
    onError: (error) => {
      console.error("Erro ao eliminar o livro:", error)
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
      if (data && data.deleteBook) {
        console.log(`Livro "${title}" eliminado correctamente.`)
        client.cache.modify({
          fields: {
            allBooks(existingBooks = []) {
              return existingBooks.filter(book => book.title !== title)
            }
          }
        })
      } else {
        console.log("Nom foi posível eliminar o livro.")
      }
    } catch (error) {
      console.error("Erro na mutaçom:", error)
    }
  }

  const handleSelectedGenre = async (genre) => {
    setSelectedGenre(genre)
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
            <button key={genre} onClick={() => handleSelectedGenre(genre)}>
              {genre}
            </button>
          ))}
        </div>
        <div>
          <button onClick={() => handleSelectedGenre(null)}>All genres</button>
        </div>
      </div>
    </div>
  )
}

export default Books
