import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNotification } from '../hooks'
import { updateBlog, addComment } from '../reducers/blogsReducer'
import CommentForm from '../components/CommentForm'
import blogService from '../services/blogs'

const Blog = () => {
  const dispatch = useDispatch()
  const showInfo = useNotification()
  const { id } = useParams()
  const blogs = useSelector(state => state.blogs)
  const blog = blogs.find(blog => blog.id === id)
  const likes = useSelector(state =>
    state.blogs.find(b => blog && b.id === blog.id)?.likes || blog.likes
  )
  const comments = useSelector(state =>
    state.blogs.find(b => blog && b.id === blog.id)?.comments || blog.comments
  )
  if (!id) {
    return null
  }

  const handleIncrementLikes = (blog) => {
    const updatedBlog = { ...blog, likes: likes + 1 }
    blogService
      .update(blog.id, updatedBlog)
      .then((response) => {
        console.log('update', response.data)
        const responseBlog = { ...response.data, user: updatedBlog.user, comments: blog.comments }
        changeLikesBlog(
          responseBlog,
          `Updated likes blog: "${response.data.likes}" likes ${response.data.likes}!`,
          false
        )
      })
      .catch((error) => {
        console.log('UpdateError', error)
        if (error && error.response && error.response.status === 400 && error.response.data) {
          changeLikesBlog(blog, error.response.data.error, true)
        } else {
          changeLikesBlog(
            blog,
            `Error on update blog: "${blog.title}" likes ${blog.likes}`,
            true
          )
        }
      })
  }

  const changeLikesBlog = (changedBlogs, message, isError) => {
    dispatch(updateBlog(changedBlogs))
    showInfo(message, isError)
  }

  const handleSaveComment = (addedComment, message, isError) => {
    dispatch(addComment(addedComment))
    showInfo(message, isError)
  }

  return (
    <div>
      {
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <div>URL: {blog.url}</div>
          <div>{blog.likes} likes <button onClick={() => handleIncrementLikes(blog)}>like</button></div>
          <div>Added by {blog.user.name}</div>
          <h3>Comments</h3>
          {comments.length === 0 && <div>No comments yet</div>}
          <CommentForm comments={comments} blogId={blog.id} onSaveComment={handleSaveComment} />
          <ul>
            {blog.comments.map(comment => <li key={comment.id}>{comment.title}</li>)}
          </ul>
        </div>
      }
    </div>
  )
}

export default Blog
