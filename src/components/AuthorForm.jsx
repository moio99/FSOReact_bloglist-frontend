import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_NUMBER } from '../queries'

const AuthorForm = ({ author, authorChange, setError }) => {
  const [born, setBorn] = useState('')

  const [ changeNumber, result ] = useMutation(EDIT_NUMBER)

  useEffect(() => {
    if (result.data && result.data.name === null) {
      setError('author not found')
    }
  }, [result.data, setError])

  const submit = async (event) => {
    event.preventDefault()

    await changeNumber({ variables: { name: author.name, setBornTo: Number(born) } })
    setBorn('')
    authorChange()
  }

  return (
    <div>
      <h2>Set birth year</h2>

      <form onSubmit={submit}>
        <div>
          name: {author.name}
        </div>
        <div>
          born <input type="number" value={born} onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm