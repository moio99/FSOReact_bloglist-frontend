import { useQuery } from '@apollo/client';
import { useEffect } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    skip: !props.show,
    fetchPolicy: "network-only"
  })

  useEffect(() => {
    if (props.show) {
      refetch()
    }
  }, [props.show, refetch])

  if (!props.show) {
    return null
  }
  
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
          </tr>
          {data?.allBooks?.map((a) => (
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

export default Books
