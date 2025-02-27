import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ( { blogs, onSaveBlog } ) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  
  const handleTitleChange = (event) => {
    const inputValue = event.target.value
    setNewTitle(inputValue)
  }

  const handleAuthorChange = (event) => {
    const inputValue = event.target.value
    setNewAuthor(inputValue)
  }
  
  const handleUrlChange = (event) => {
    const inputValue = event.target.value
    setNewUrl(inputValue)
  }

  const handleAddBlog = (event) => {
    event.preventDefault()

    const form = event.target
    const inputTitle = form.querySelector("input[id='title']").value
    const inputAuthor = form.querySelector("input[id='author']").value
    const inputUrl = form.querySelector("input[id='url']").value
    if (inputTitle.length > 0) {
      const blog = blogs.find(blog => blog.title.toLocaleLowerCase() === inputTitle.toLocaleLowerCase())
      if (blog) {
        updateBlog(blog, inputAuthor, inputUrl)
      } else {
        addBlog(inputTitle, inputAuthor, inputUrl)
      }
    }
  }

  const updateBlog = (blog, inputAuthor, inputUrl) => { 
    const confirmText = `The title "${blog.title}" is already added to the blog list, update the old values author: "${blog.author}" url: "${blog.url}"?` 
    if (window.confirm(confirmText)) {
      const updateBlog = {title: blog.title, author: inputAuthor, url: inputUrl, likes: blog.likes}
      blogService.update(blog.id, updateBlog)
        .then(response => {
          console.log('update', response.data)
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          const newBlogs = blogs.map(b => (b.id === blog.id ? response.data : b))
          onSaveBlog(newBlogs, `Updated blog: "${response.data.title}"!`, false)
        })
        .catch(error => { 
          console.log('UpdateError', error.response.data.error)
          if (error.response.status === 400) {
            onSaveBlog(blogs, error.response.data.error, true)
          } else {
            onSaveBlog(blogs, `Error on update "${blog.title}"`, true)
          }
        })
    }
  }

  const addBlog = (inputTitle, inputAuthor, inputUrl) => { 
    const newBlog = {title: inputTitle, author: inputAuthor, url: inputUrl}
    blogService.create(newBlog)
      .then(response => {
        console.log('create', response.data)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        const newBlogs = blogs.concat(response.data)
        onSaveBlog(newBlogs, `Added blog title: "${response.data.title}"!`, false)
      })
      .catch(error => {
        console.log('CreateError', error.response.data.error)
        if (error.response.status === 400) {
          onSaveBlog(blogs, error.response.data.error, true)
        } else {
          onSaveBlog(blogs, `Error on create ""${blog.title}"`, true)
        }
      })
  }

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        title: <input id='title' value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
        author: <input id='author' value={newAuthor} onChange={handleAuthorChange} />
      </div>
      <div>
        url: <input id='url' value={newUrl} onChange={handleUrlChange} />
      </div>
      <div>
        <button type='submit' value={newUrl}>create</button>
      </div>
    </form>
  )
}

export default BlogForm