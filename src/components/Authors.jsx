import { gql, useQuery } from '@apollo/client';

const ALL_PERSONS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const Authors = (props) => {
  const { data, loading, error } = useQuery(ALL_PERSONS, {
    skip: !props.show,
  })

  if (!props.show) {
    return null;
  }
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data?.allAuthors?.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || "N/A"}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
