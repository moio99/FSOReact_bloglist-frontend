import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onChangeLikesBlog, onRemoveBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleToggleVisibility = () => {
    setVisible(!visible)
  }

  const handleIncrementLikes = () => {
    blog.likes = blog.likes + 1
    blogService.update(blog.id, blog)
      .then(response => {
        console.log('update', response.data)
        onChangeLikesBlog(blog, `Updated likes blog: "${response.data.likes}" likes ${response.data.likes}!`, false)
      })
      .catch(error => { 
        console.log('UpdateError', error.response.data.error)
        if (error.response.status === 400) {
          onChangeLikesBlog(blog, error.response.data.error, true)
        } else {
          onChangeLikesBlog(blog, `Error on update blog: "${blog.title}" likes ${blog.likes}`, true)
        }
      })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title}`)) {
      blogService.deleteById(blog.id)
        .then(() => {
          console.log('delete', blog.title)
          onRemoveBlog(blog.id, `delete blog: "${blog.title}"!`, false)
        })
        .catch(error => { 
          console.log('DeleteError', error.response.data.error)
          if (error.response.status === 400) {
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
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} {blog.author} 
          <button style={hideWhenVisible} onClick={() => handleToggleVisibility()}>view</button>
          <button style={showWhenVisible} onClick={() => handleToggleVisibility()}>hide</button>
      </p>
      <div style={showWhenVisible}>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes} <button onClick={() => handleIncrementLikes()}>like</button></p>
        <p>author: {blog.author}</p>
        {blog.user.id === user.id && (
          <p><button onClick={() => handleRemove()}>remove</button></p>
        )}
      </div>
    </div>
  )
}

export default Blog