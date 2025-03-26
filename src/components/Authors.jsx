import { useState } from "react"
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import AuthorForm from "./AuthorForm"
import { ALL_PERSONS } from '../queries'

const Authors = ({show, setError}) => {
  const { data, loading, error, refetch } = useQuery(ALL_PERSONS, {
    skip: !show,
  })
  const [selectedAuthor, setSelectedAuthor] = useState(null)

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, refetch, selectedAuthor===null])

  if (!show) {
    return null
  }
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author)
  }
  const handleAuthorChange = () => {
    setSelectedAuthor(null)
  }

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
              <td onClick={() => handleAuthorClick(a)} 
                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>{a.name}</td>
              <td>{a.born || "N/A"}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAuthor && <AuthorForm author={selectedAuthor} authorChange={handleAuthorChange} setError={setError} />}
    </div>
  )
}

export default Authors
