import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const { id } = useParams()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  if (!id) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Added blogs:</p>
      <ul>
        {blogs.map(blog => blog.user.id === id && <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

export default User
