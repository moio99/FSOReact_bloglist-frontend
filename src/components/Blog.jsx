import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const onToggleVisibility = () => {
    setVisible(!visible)
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
          <button style={hideWhenVisible} onClick={() => onToggleVisibility()}>view</button>
          <button style={showWhenVisible} onClick={() => onToggleVisibility()}>hide</button>
      </p>
      <div style={showWhenVisible}>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes} <button>like</button></p>
        <p>author: {blog.author}</p>
      </div>
    </div>
  )
}

export default Blog