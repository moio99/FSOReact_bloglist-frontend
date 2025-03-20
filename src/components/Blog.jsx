import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onChangeLikesBlog, onRemoveBlog }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleToggleVisibility = () => {
    setVisible(!visible)
  }

  const handleIncrementLikes = () => {
    const updatedBlog = { ...blog, likes: likes + 1 } 
    blogService
      .update(blog.id, updatedBlog)
      .then((response) => {
        console.log('update', response.data)
        setLikes(response.data.likes)
        const responseBlog = { ...response.data, user: updatedBlog.user }
        onChangeLikesBlog(
          responseBlog,
          `Updated likes blog: "${response.data.likes}" likes ${response.data.likes}!`,
          false
        )
      })
      .catch((error) => {
        console.log('UpdateError', error)
        if (error && error.response && error.response.status === 400 && error.response.data) {
          onChangeLikesBlog(blog, error.response.data.error, true)
        } else {
          onChangeLikesBlog(
            blog,
            `Error on update blog: "${blog.title}" likes ${blog.likes}`,
            true
          )
        }
      })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title}`)) {
      blogService
        .deleteById(blog.id)
        .then(() => {
          console.log('delete', blog.title)
          onRemoveBlog(blog.id, `delete blog: "${blog.title}"!`, false)
        })
        .catch((error) => {
          console.log('DeleteError', error)
          if (error && error.response && error.response.status === 400 && error.response.data) {
            onRemoveBlog(blog.id, error.response.data.error, true)
          } else {
            onRemoveBlog(blog.id, `Error on delete blog: "${blog.title}"`, true)
          }
        })
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <p>
        <span>{blog.title}</span> <span>{blog.author}</span>
        <button
          style={hideWhenVisible}
          className="view-hide"
          onClick={() => handleToggleVisibility()}
        >
          view
        </button>
        <button
          style={showWhenVisible}
          className="view-hide"
          onClick={() => handleToggleVisibility()}
        >
          hide
        </button>
      </p>
      <div style={showWhenVisible} id="moreInfo">
        <p>url: {blog.url}</p>
        <p>
          likes: {likes}{' '}
          <button onClick={() => handleIncrementLikes()}>like</button>
        </p>
        <p>author: {blog.author}</p>
        {blog.user.id === user.id && (
          <p>
            <button onClick={() => handleRemove()}>remove</button>
          </p>
        )}
      </div>
    </div>
  )
}

export default Blog
