import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { ALL_BOOKS } from '../queries'

const Recommendations = ({ show, favoriteGenre }) => {

  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    skip: !show,
    fetchPolicy: "network-only"
  })

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, refetch])

  if (!show) {
    return null
  }
  
  const filteredBooks = data?.allBooks.filter(book => book.genres.includes(favoriteGenre))

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre: {favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
